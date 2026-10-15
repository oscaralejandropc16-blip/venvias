import { computed, reactive, ref, type ComputedRef, type Reactive, type Ref } from 'vue'
import { errorMessage } from '@/core/utils/ErrorUtils'
import { formatMoney } from '@/core/utils/money'
import { usePlateEntry } from '@/modules/plates/composables/usePlateEntry'
import { formatPlate } from '@/modules/plates/utils/plate'
import { useIpgPayment, type UseIpgPaymentApi } from '@/modules/payments/composables/useIpgPayment'
import { RECHARGE_AMOUNT_MESSAGES, RECHARGE_PAY_MESSAGES } from '../constants/recharge'
import { createRecharge } from '../services/recharge.service'
import type { RechargeAmountOption } from '../types/RechargeAmountOption'
import type { RechargeReceipt } from '../types/RechargeReceipt'
import type { RechargeSummary } from '../types/RechargeSummary'
import { parseAmount } from '../utils/amount'
import { useRechargeOptions, type UseRechargeOptionsApi } from './useRechargeOptions'

export interface UseRechargeFlowApi extends UseRechargeOptionsApi {
  plate: Ref<string>
  plateError: Ref<string>
  plateHint: Ref<string>
  plateValid: ComputedRef<boolean>
  amountId: Ref<string>
  customAmount: Ref<string>
  selectedAmount: ComputedRef<RechargeAmountOption | null>
  amount: ComputedRef<number | null>
  amountError: Ref<string>
  amountValid: ComputedRef<boolean>
  paymentMethod: Ref<string>
  summary: ComputedRef<RechargeSummary | null>
  paying: Ref<boolean>
  payError: Ref<string>
  receipt: Ref<RechargeReceipt | null>
  /** Botón de Pago IPG: datos del pagador, código OTP y resultado. */
  ipgPayment: Reactive<UseIpgPaymentApi>
  loadOptions: () => Promise<void>
  setPlate: (raw: string) => void
  confirmPlate: () => boolean
  selectAmount: (id: string) => void
  setCustomAmount: (text: string) => void
  validateAmount: () => boolean
  selectPaymentMethod: (id: string) => void
  pay: () => Promise<RechargeReceipt | null>
  requestIpgOtp: () => Promise<boolean>
  confirmIpgOtp: () => Promise<RechargeReceipt | null>
  settleIpgRecharge: () => Promise<RechargeReceipt | null>
  restart: () => void
}

/**
 * Estado y reglas de la recarga en cuatro pasos (placa → monto → pago → listo).
 * Las reglas del monto llegan del service; la vista decide la navegación.
 */
export function useRechargeFlow(): UseRechargeFlowApi {
  const options = useRechargeOptions()
  const { amountOptions, paymentMethods, limits } = options
  const entry = usePlateEntry()
  const ipg = useIpgPayment()
  const ipgPayment = reactive(ipg)

  const amountId = ref('')
  const customAmount = ref('')
  const amountError = ref('')
  const paymentMethod = ref('')
  const paying = ref(false)
  const payError = ref('')
  const receipt = ref<RechargeReceipt | null>(null)
  let payToken = 0

  const selectedAmount = computed(() => amountOptions.value.find((o) => o.id === amountId.value) ?? null)
  const amount = computed(() => {
    const option = selectedAmount.value
    if (!option) return null
    return option.custom ? parseAmount(customAmount.value) : option.amount
  })

  function amountProblem(): string {
    const value = amount.value
    if (value === null || value <= 0) return RECHARGE_AMOUNT_MESSAGES.required
    const rules = limits.value
    if (!rules) return RECHARGE_AMOUNT_MESSAGES.unavailable
    if (value < rules.min) return RECHARGE_AMOUNT_MESSAGES.min(rules.minLabel)
    if (value > rules.max) return RECHARGE_AMOUNT_MESSAGES.max(rules.maxLabel)
    if (value % rules.step !== 0) return RECHARGE_AMOUNT_MESSAGES.step(rules.stepLabel)
    return ''
  }

  const amountValid = computed(() => amountProblem() === '')

  const summary = computed<RechargeSummary | null>(() => {
    const rules = limits.value
    if (!rules || !amountValid.value || amount.value === null) return null
    const money = (value: number) => formatMoney(value, rules.currency)
    return {
      plate: formatPlate(entry.plate.value),
      amount: money(amount.value),
      fee: money(rules.fee),
      total: money(amount.value + rules.fee),
    }
  })

  function defaultPaymentMethod(): string {
    return paymentMethods.value[0]?.id ?? ''
  }

  async function loadOptions(): Promise<void> {
    // Los métodos IPG no frenan la recarga: si fallan, el formulario del Botón de Pago ofrece reintentar.
    await Promise.all([options.fetchOptions(), ipg.loadMethods()])
    if (!paymentMethods.value.some((m) => m.id === paymentMethod.value))
      paymentMethod.value = defaultPaymentMethod()
  }

  function setPlate(raw: string): void {
    entry.applyInput(raw, raw.length)
  }

  function confirmPlate(): boolean {
    return entry.validate() !== null
  }

  function selectAmount(id: string): void {
    if (!amountOptions.value.some((o) => o.id === id)) return
    amountId.value = id
    amountError.value = ''
  }

  function setCustomAmount(text: string): void {
    customAmount.value = text
    amountError.value = ''
    const custom = amountOptions.value.find((o) => o.custom)
    if (custom) amountId.value = custom.id
  }

  function validateAmount(): boolean {
    amountError.value = amountProblem()
    return !amountError.value
  }

  function selectPaymentMethod(id: string): void {
    if (id !== paymentMethod.value) ipg.reset()
    paymentMethod.value = id
    payError.value = ''
  }

  async function pay(): Promise<RechargeReceipt | null> {
    if (paying.value) return null
    const submission = entry.validate()
    if (!submission || !validateAmount() || amount.value === null) return null
    if (!paymentMethod.value) {
      payError.value = RECHARGE_PAY_MESSAGES.methodRequired
      return null
    }

    const token = ++payToken
    paying.value = true
    payError.value = ''
    try {
      const result = await createRecharge({
        plate: submission.plate,
        amount: amount.value,
        paymentMethod: paymentMethod.value,
      })
      if (token !== payToken) return null
      receipt.value = result
      return result
    } catch (err) {
      if (token !== payToken) return null
      payError.value = errorMessage(err, RECHARGE_PAY_MESSAGES.failed)
      return null
    } finally {
      if (token === payToken) paying.value = false
    }
  }

  /** Placa y monto válidos para cobrar, o `null` (los errores quedan en sus campos). */
  function validCharge(): { plate: string; amount: number } | null {
    const submission = entry.validate()
    if (!submission || !validateAmount() || amount.value === null) return null
    return { plate: submission.plate, amount: amount.value }
  }

  /** Datos del pagador → código OTP. El banco cobra el total, con la comisión. */
  async function requestIpgOtp(): Promise<boolean> {
    const charge = validCharge()
    const rules = limits.value
    if (!charge || !rules) return false
    payError.value = ''
    return ipg.requestOtp({
      amount: charge.amount + rules.fee,
      currency: rules.currency,
      concept: { type: 'recharge', reference: charge.plate },
    })
  }

  /** Acredita a la placa un cobro IPG ya aprobado; se puede reintentar sin cobrar de nuevo. */
  async function settleIpgRecharge(): Promise<RechargeReceipt | null> {
    const approved = ipg.result.value
    if (paying.value || approved?.status !== 'approved') return null
    const charge = validCharge()
    if (!charge) return null

    const token = ++payToken
    paying.value = true
    payError.value = ''
    try {
      const result = await createRecharge({
        plate: charge.plate,
        amount: charge.amount,
        paymentMethod: 'ipg',
        paymentReference: approved.operationNumber,
      })
      if (token !== payToken) return null
      receipt.value = result
      return result
    } catch {
      if (token !== payToken) return null
      // El cobro ya pasó: el mensaje lo dice siempre, aunque el backend dé otro motivo.
      payError.value = RECHARGE_PAY_MESSAGES.settleFailed
      return null
    } finally {
      if (token === payToken) paying.value = false
    }
  }

  /** Código OTP → resultado. Aprobado, acredita la recarga y devuelve el comprobante. */
  async function confirmIpgOtp(): Promise<RechargeReceipt | null> {
    const outcome = await ipg.confirmOtp()
    if (outcome?.status !== 'approved') return null
    return settleIpgRecharge()
  }

  function restart(): void {
    ipg.reset()
    payToken++
    paying.value = false
    entry.applyInput('', 0)
    amountId.value = ''
    customAmount.value = ''
    amountError.value = ''
    paymentMethod.value = defaultPaymentMethod()
    payError.value = ''
    receipt.value = null
  }

  return {
    ...options,
    plate: entry.plate,
    plateError: entry.error,
    plateHint: entry.hint,
    plateValid: entry.isValid,
    amountId,
    customAmount,
    selectedAmount,
    amount,
    amountError,
    amountValid,
    paymentMethod,
    summary,
    paying,
    payError,
    receipt,
    ipgPayment,
    loadOptions,
    setPlate,
    confirmPlate,
    selectAmount,
    setCustomAmount,
    validateAmount,
    selectPaymentMethod,
    pay,
    requestIpgOtp,
    confirmIpgOtp,
    settleIpgRecharge,
    restart,
  }
}
