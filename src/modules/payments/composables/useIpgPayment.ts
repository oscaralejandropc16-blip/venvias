import { computed, reactive, ref, type ComputedRef, type Ref } from 'vue'
import { errorMessage } from '@/core/utils/ErrorUtils'
import { formatMoney } from '@/core/utils/money'
import {
  DOCUMENT_TYPES_BY_PERSON,
  IPG_ERROR_MESSAGES,
  IPG_PAYMENT_MESSAGES,
  ipgOtpInvalidMessage,
} from '../constants/ipgPayment'
import { confirmIpgPayment, getIpgMethods, requestIpgPayment } from '../services/ipgPayment.service'
import type { IpgCharge } from '../types/IpgCharge'
import type { IpgMethod } from '../types/IpgMethod'
import type { IpgOtpChallenge } from '../types/IpgOtpChallenge'
import type { DocumentType, IpgPayer, IpgPayerField, PersonType } from '../types/IpgPayer'
import { IpgPaymentError } from '../types/IpgPaymentError'
import type { IpgPaymentResult } from '../types/IpgPaymentResult'
import type { IpgPaymentStage } from '../types/IpgPaymentStage'
import { documentProblem, maskDocument, normalizeDocumentNumber } from '../utils/document'

export interface UseIpgPaymentApi {
  stage: Ref<IpgPaymentStage>
  personType: Ref<PersonType>
  documentType: Ref<DocumentType>
  documentNumber: Ref<string>
  /** Método IPG elegido (cuenta o tarjeta); `null` mientras no se elija. */
  methodId: Ref<number | null>
  documentTypes: ComputedRef<{ value: DocumentType; label: string }[]>
  fieldErrors: ComputedRef<Record<IpgPayerField, string>>
  payerValid: ComputedRef<boolean>
  /** Datos que aún impiden pagar, en el orden del formulario. */
  missingFields: ComputedRef<IpgPayerField[]>
  /** Nombre corto del método elegido, para el resumen sobre el código. */
  methodName: ComputedRef<string>
  maskedDocument: ComputedRef<string>
  methods: Ref<IpgMethod[]>
  methodsLoading: Ref<boolean>
  methodsError: Ref<string>
  requesting: Ref<boolean>
  requestError: Ref<string>
  challenge: Ref<IpgOtpChallenge | null>
  otp: Ref<string>
  otpComplete: ComputedRef<boolean>
  confirming: Ref<boolean>
  otpError: Ref<string>
  result: Ref<IpgPaymentResult | null>
  loadMethods: () => Promise<void>
  setPersonType: (type: PersonType) => void
  setDocumentType: (type: DocumentType) => void
  setDocumentNumber: (raw: string) => void
  touch: (field: IpgPayerField) => void
  selectMethod: (id: number) => void
  requestOtp: (charge: IpgCharge) => Promise<boolean>
  setOtp: (value: string) => void
  confirmOtp: () => Promise<IpgPaymentResult | null>
  backToPayer: () => void
  reset: () => void
}

/**
 * Botón de Pago IPG en tres subestados: datos del pagador → código OTP →
 * resultado. No sabe qué se cobra: el contexto pasa el `IpgCharge` al pedir
 * el código y decide qué hacer con el resultado.
 */
export function useIpgPayment(): UseIpgPaymentApi {
  const stage = ref<IpgPaymentStage>('payer')
  const personType = ref<PersonType>('natural')
  const documentType = ref<DocumentType>(DOCUMENT_TYPES_BY_PERSON.natural[0].value)
  const documentNumber = ref('')
  const methodId = ref<number | null>(null)
  const touched = reactive<Record<IpgPayerField, boolean>>({ documentNumber: false, methodId: false })

  const methods = ref<IpgMethod[]>([])
  const methodsLoading = ref(false)
  const methodsError = ref('')
  let methodsToken = 0

  const requesting = ref(false)
  const requestError = ref('')
  const challenge = ref<IpgOtpChallenge | null>(null)
  const otp = ref('')
  const confirming = ref(false)
  const otpError = ref('')
  const result = ref<IpgPaymentResult | null>(null)
  // Invalida respuestas viejas: volver o reiniciar descarta lo que esté en vuelo.
  let flowToken = 0
  // Lo que se está cobrando: si el banco no responde al confirmar, el resultado «por confirmar» lo muestra.
  let pendingCharge: IpgCharge | null = null

  const documentTypes = computed(() => DOCUMENT_TYPES_BY_PERSON[personType.value])
  const selectedMethod = computed(() => methods.value.find((m) => m.id === methodId.value) ?? null)

  const problems = computed<Record<IpgPayerField, string>>(() => ({
    documentNumber: documentProblem(documentType.value, documentNumber.value),
    methodId: selectedMethod.value ? '' : IPG_PAYMENT_MESSAGES.methodRequired,
  }))

  // Los errores se muestran al salir del campo; desde ahí se corrigen en vivo.
  const fieldErrors = computed<Record<IpgPayerField, string>>(() => ({
    documentNumber: touched.documentNumber ? problems.value.documentNumber : '',
    methodId: touched.methodId ? problems.value.methodId : '',
  }))

  const missingFields = computed(() =>
    (Object.keys(problems.value) as IpgPayerField[]).filter((field) => problems.value[field]),
  )
  const payerValid = computed(() => missingFields.value.length === 0)
  const methodName = computed(() => selectedMethod.value?.shortName ?? '')
  const maskedDocument = computed(() => maskDocument(documentType.value, documentNumber.value))
  const otpLength = computed(() => challenge.value?.otpLength ?? 0)
  const otpComplete = computed(() => otpLength.value > 0 && otp.value.length === otpLength.value)

  async function loadMethods(): Promise<void> {
    const token = ++methodsToken
    methodsLoading.value = true
    methodsError.value = ''
    try {
      const list = await getIpgMethods()
      if (token !== methodsToken) return
      methods.value = list
      if (methodId.value !== null && !list.some((m) => m.id === methodId.value)) methodId.value = null
    } catch (err) {
      if (token !== methodsToken) return
      methodsError.value = errorMessage(err, IPG_PAYMENT_MESSAGES.methodsFailed)
    } finally {
      if (token === methodsToken) methodsLoading.value = false
    }
  }

  function setPersonType(type: PersonType): void {
    if (type === personType.value) return
    personType.value = type
    // Una cédula nunca es un RIF: el tipo y el número arrancan de nuevo.
    documentType.value = DOCUMENT_TYPES_BY_PERSON[type][0].value
    documentNumber.value = ''
    touched.documentNumber = false
    requestError.value = ''
  }

  function setDocumentType(type: DocumentType): void {
    if (!documentTypes.value.some((d) => d.value === type)) return
    documentType.value = type
    documentNumber.value = normalizeDocumentNumber(type, documentNumber.value)
    requestError.value = ''
  }

  function setDocumentNumber(raw: string): void {
    documentNumber.value = normalizeDocumentNumber(documentType.value, raw)
    requestError.value = ''
  }

  function touch(field: IpgPayerField): void {
    touched[field] = true
  }

  function selectMethod(id: number): void {
    if (!methods.value.some((m) => m.id === id)) return
    methodId.value = id
    touched.methodId = true
    requestError.value = ''
  }

  function payer(method: number): IpgPayer {
    return {
      personType: personType.value,
      documentType: documentType.value,
      documentNumber: documentNumber.value,
      methodId: method,
    }
  }

  async function requestOtp(charge: IpgCharge): Promise<boolean> {
    if (requesting.value || stage.value !== 'payer') return false
    touch('documentNumber')
    touch('methodId')
    const method = methodId.value
    if (!payerValid.value || method === null) return false

    const token = ++flowToken
    requesting.value = true
    requestError.value = ''
    try {
      const next = await requestIpgPayment(payer(method), charge)
      if (token !== flowToken) return false
      challenge.value = next
      pendingCharge = charge
      otp.value = ''
      otpError.value = ''
      result.value = null
      stage.value = 'otp'
      return true
    } catch (err) {
      if (token !== flowToken) return false
      requestError.value =
        err instanceof IpgPaymentError && err.kind !== 'otp_invalid'
          ? IPG_ERROR_MESSAGES[err.kind]
          : errorMessage(err, IPG_PAYMENT_MESSAGES.requestFailed)
      return false
    } finally {
      if (token === flowToken) requesting.value = false
    }
  }

  function setOtp(value: string): void {
    otp.value = value.replace(/\D/g, '').slice(0, otpLength.value || undefined)
    otpError.value = ''
  }

  async function confirmOtp(): Promise<IpgPaymentResult | null> {
    const current = challenge.value
    if (confirming.value || stage.value !== 'otp' || !current) return null
    if (!otpComplete.value) {
      otpError.value = IPG_PAYMENT_MESSAGES.otpIncomplete(current.otpLength)
      return null
    }

    const token = ++flowToken
    confirming.value = true
    otpError.value = ''
    try {
      const outcome = await confirmIpgPayment(current.challengeId, otp.value)
      if (token !== flowToken) return null
      result.value = outcome
      stage.value = 'result'
      return outcome
    } catch (err) {
      if (token !== flowToken) return null
      handleConfirmFailure(err)
      return null
    } finally {
      if (token === flowToken) confirming.value = false
    }
  }

  /** Resultado «por confirmar»: el banco no respondió y el cargo pudo hacerse. */
  function unknownResult(): IpgPaymentResult {
    return {
      status: 'unknown',
      operationNumber: '',
      amount: pendingCharge ? formatMoney(pendingCharge.amount, pendingCharge.currency) : '',
      processedAt: '',
      reason: '',
    }
  }

  /**
   * Cada falla lleva a su sitio: código incorrecto → se queda y se borra; vencido
   * o bloqueado → vuelve a los datos (el reto ya no sirve); sin respuesta → resultado
   * «por confirmar», para no invitar a pagar dos veces.
   */
  function handleConfirmFailure(err: unknown): void {
    if (!(err instanceof IpgPaymentError)) {
      otpError.value = errorMessage(err, IPG_PAYMENT_MESSAGES.confirmFailed)
      return
    }
    switch (err.kind) {
      case 'otp_invalid':
        otp.value = ''
        otpError.value = ipgOtpInvalidMessage(err.attemptsLeft)
        return
      case 'otp_expired':
      case 'otp_blocked':
        backToPayer()
        requestError.value = IPG_ERROR_MESSAGES[err.kind]
        return
      case 'confirm_unknown':
        challenge.value = null
        result.value = unknownResult()
        stage.value = 'result'
        return
      default:
        otpError.value = IPG_ERROR_MESSAGES[err.kind]
    }
  }

  /** Vuelve a los datos del pagador sin perderlos; descarta el reto y lo que esté en vuelo. */
  function backToPayer(): void {
    flowToken++
    requesting.value = false
    confirming.value = false
    requestError.value = ''
    challenge.value = null
    pendingCharge = null
    otp.value = ''
    otpError.value = ''
    result.value = null
    stage.value = 'payer'
  }

  /** Deja el pago como nuevo; los métodos ya cargados se conservan. */
  function reset(): void {
    backToPayer()
    personType.value = 'natural'
    documentType.value = DOCUMENT_TYPES_BY_PERSON.natural[0].value
    documentNumber.value = ''
    methodId.value = null
    touched.documentNumber = false
    touched.methodId = false
  }

  return {
    stage,
    personType,
    documentType,
    documentNumber,
    methodId,
    documentTypes,
    fieldErrors,
    payerValid,
    missingFields,
    methodName,
    maskedDocument,
    methods,
    methodsLoading,
    methodsError,
    requesting,
    requestError,
    challenge,
    otp,
    otpComplete,
    confirming,
    otpError,
    result,
    loadMethods,
    setPersonType,
    setDocumentType,
    setDocumentNumber,
    touch,
    selectMethod,
    requestOtp,
    setOtp,
    confirmOtp,
    backToPayer,
    reset,
  }
}
