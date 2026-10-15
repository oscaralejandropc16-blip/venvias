/**
 * Service del Botón de Pago IPG del Banco de Venezuela. Es la única capa que
 * conoce los paths y los DTO. La lista de métodos sigue la respuesta real del
 * backend (`paymentMethods`); el resto del contrato es provisional: cuando
 * llegue la API completa solo cambia este archivo. Sin backend sirve el mock.
 */

import { HttpError, hasApiBackend, httpClient } from '@/core/api/httpClient'
import { mapIpgMethodDtoToView } from '../mappers/ipgMethod.mapper'
import { mapIpgOtpChallengeDtoToView } from '../mappers/ipgOtpChallenge.mapper'
import { mapIpgPaymentResultDtoToView } from '../mappers/ipgPaymentResult.mapper'
import type { IpgCharge } from '../types/IpgCharge'
import type { IpgMethod } from '../types/IpgMethod'
import type { IpgMethodDto } from '../types/IpgMethodDto'
import type { IpgOtpChallenge } from '../types/IpgOtpChallenge'
import type { IpgOtpChallengeDto } from '../types/IpgOtpChallengeDto'
import type { IpgPayer } from '../types/IpgPayer'
import { IpgPaymentError, type IpgErrorKind } from '../types/IpgPaymentError'
import type { IpgPaymentResult } from '../types/IpgPaymentResult'
import type { IpgPaymentResultDto } from '../types/IpgPaymentResultDto'
import ipgPaymentMock from './ipgPayment.mock.json'

const PATHS = {
  methods: '/public/payments/ipg/payment-methods/',
  payments: '/public/payments/ipg/',
  confirm: (challengeId: string) => `/public/payments/ipg/${encodeURIComponent(challengeId)}/confirm/`,
}

// Toda falla del pago se explica en el formulario, no en un toast (incluida la falta de conexión: 0).
const SILENT_STATUSES = [0, 400, 402, 408, 409, 410, 422, 423, 429, 500, 502, 503, 504]

/** Código de error del backend (`payload.code`) → falla de la UI. Contrato supuesto: confirmar con el backend. */
const ERROR_CODES: Record<string, IpgErrorKind> = {
  PAYER_REJECTED: 'payer_rejected',
  METHOD_UNAVAILABLE: 'method_unavailable',
  BANK_UNAVAILABLE: 'bank_unavailable',
  PAYMENT_IN_PROGRESS: 'payment_in_progress',
  OTP_INVALID: 'otp_invalid',
  OTP_EXPIRED: 'otp_expired',
  OTP_BLOCKED: 'otp_blocked',
}

type IpgCall = 'request' | 'confirm'

function payloadField(payload: unknown, key: string): unknown {
  return payload && typeof payload === 'object' ? (payload as Record<string, unknown>)[key] : undefined
}

/** Sin código conocido, el estado HTTP decide. Al confirmar, una caída deja el cargo en duda. */
function kindFromStatus(status: number, call: IpgCall): IpgErrorKind | null {
  const unreachable = status === 0 || status === 408 || status >= 500
  if (unreachable) return call === 'confirm' ? 'confirm_unknown' : 'bank_unavailable'
  if (status === 409) return 'payment_in_progress'
  if (call === 'request' && status === 422) return 'payer_rejected'
  if (call === 'confirm' && status === 410) return 'otp_expired'
  if (call === 'confirm' && (status === 423 || status === 429)) return 'otp_blocked'
  return null
}

/** Traduce el error HTTP a una falla de la UI; lo que no se reconoce sigue como vino. */
function toIpgError(error: unknown, call: IpgCall): unknown {
  if (!(error instanceof HttpError)) return error
  const code = payloadField(error.payload, 'code')
  const kind = (typeof code === 'string' && ERROR_CODES[code]) || kindFromStatus(error.status, call)
  if (!kind) return error
  const attempts = payloadField(error.payload, 'attempts_left')
  return new IpgPaymentError(kind, typeof attempts === 'number' ? attempts : null)
}

interface IpgMethodsDto {
  paymentMethods: IpgMethodDto[]
}

/** Métodos del Botón de Pago IPG: cuentas de ahorro y corriente, y tarjetas. */
export async function getIpgMethods(): Promise<IpgMethod[]> {
  const response = hasApiBackend
    ? await httpClient.get<IpgMethodsDto>(PATHS.methods)
    : (ipgPaymentMock as IpgMethodsDto)
  return response.paymentMethods.map(mapIpgMethodDtoToView)
}

/*
 * Mock. Cada reto recuerda lo que se cobra y los intentos fallidos. Para probar
 * los errores (ver `triggers` en el JSON):
 * - el documento termina en 0000, 1111, 2222 o 3333 → falla al pedir el código;
 * - el código es un dígito repetido: 9 rechazado, 0 incorrecto (al tercero, bloqueado),
 *   1 vencido, 2 sin respuesta del banco, 3 aprobado pero la recarga no se acredita
 *   al primer intento. Cualquier otro código se aprueba.
 */
const { triggers } = ipgPaymentMock
const mockChallenges = new Map<string, { charge: IpgCharge; failures: number }>()
let mockSequence = 0

function mockChallenge(payer: IpgPayer, charge: IpgCharge): IpgOtpChallengeDto {
  const suffix = payer.documentNumber.slice(-4) as keyof typeof triggers.requestErrorByDocumentSuffix
  const failure = triggers.requestErrorByDocumentSuffix[suffix] as IpgErrorKind | undefined
  if (failure) throw new IpgPaymentError(failure)
  const challengeId = `mock-${Date.now().toString(36)}-${++mockSequence}`
  mockChallenges.set(challengeId, { charge, failures: 0 })
  return { challenge_id: challengeId, otp_length: ipgPaymentMock.otpLength }
}

function mockConfirm(challengeId: string, otp: string): IpgPaymentResultDto {
  const entry = mockChallenges.get(challengeId)
  if (!entry) throw new IpgPaymentError('otp_expired')
  const repeated = /^(\d)\1*$/.exec(otp)?.[1] as keyof typeof triggers.confirmByRepeatedDigit | undefined
  const scenario = repeated ? triggers.confirmByRepeatedDigit[repeated] : undefined

  if (scenario === 'otp_invalid') {
    entry.failures += 1
    const attemptsLeft = ipgPaymentMock.otpAttempts - entry.failures
    if (attemptsLeft > 0) throw new IpgPaymentError('otp_invalid', attemptsLeft)
    mockChallenges.delete(challengeId)
    throw new IpgPaymentError('otp_blocked')
  }
  if (scenario === 'otp_expired' || scenario === 'confirm_unknown') {
    mockChallenges.delete(challengeId)
    throw new IpgPaymentError(scenario)
  }

  mockChallenges.delete(challengeId)
  const denied = scenario === 'denied'
  return {
    status: denied ? 'denied' : 'approved',
    operation_number:
      scenario === 'settle_fail'
        ? triggers.settleFailOperationNumber
        : String(Math.floor(Math.random() * 1_000_000_000)).padStart(9, '0'),
    amount: entry.charge.amount,
    currency: entry.charge.currency,
    processed_at: new Date().toISOString(),
    reason: denied ? ipgPaymentMock.deniedReason : null,
  }
}

/** Envía los datos del pagador y lo que se cobra; el banco responde con un reto OTP. */
export async function requestIpgPayment(payer: IpgPayer, charge: IpgCharge): Promise<IpgOtpChallenge> {
  if (!hasApiBackend) return mapIpgOtpChallengeDtoToView(mockChallenge(payer, charge))
  try {
    const dto = await httpClient.post<IpgOtpChallengeDto>(
        PATHS.payments,
        {
          person_type: payer.personType,
          document_type: payer.documentType,
          document_number: payer.documentNumber,
          payment_method_id: payer.methodId,
          amount: charge.amount,
          currency: charge.currency,
          concept: charge.concept,
        },
        { silentStatuses: SILENT_STATUSES },
      )
    return mapIpgOtpChallengeDtoToView(dto)
  } catch (error) {
    throw toIpgError(error, 'request')
  }
}

/** Confirma el reto con el código de la app BDV: aprobado o rechazado; las fallas llegan como `IpgPaymentError`. */
export async function confirmIpgPayment(challengeId: string, otp: string): Promise<IpgPaymentResult> {
  if (!hasApiBackend) return mapIpgPaymentResultDtoToView(mockConfirm(challengeId, otp))
  try {
    const dto = await httpClient.post<IpgPaymentResultDto>(
      PATHS.confirm(challengeId),
      { otp },
      { silentStatuses: SILENT_STATUSES },
    )
    return mapIpgPaymentResultDtoToView(dto)
  } catch (error) {
    throw toIpgError(error, 'confirm')
  }
}
