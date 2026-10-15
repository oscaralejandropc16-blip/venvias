import mastercardLogo from '@/assets/logos/master_card_logo.svg'
import visaLogo from '@/assets/logos/visa_logo.svg'
import type { SegmentedOption } from '@/shared/ui/SegmentedControl.vue'
import type { DocumentType, IpgPayerField, PersonType } from '../types/IpgPayer'
import type { IpgErrorKind } from '../types/IpgPaymentError'
import type { IpgPaymentStatus } from '../types/IpgPaymentResult'

/**
 * Logo de marca de cada método IPG, por su id en el backend. Las cuentas no
 * llevan logo (el del Banco de Venezuela está pendiente). Archivos oficiales
 * de Visa y Mastercard: usarlos tal cual, sin recortar ni recolorear.
 */
const IPG_METHOD_LOGOS: Record<number, string> = {
  3: visaLogo,
  4: mastercardLogo,
  21: mastercardLogo,
}

export function ipgMethodLogo(methodId: number): string | undefined {
  return IPG_METHOD_LOGOS[methodId]
}

/** Dígitos del código OTP cuando el banco no los indica. */
export const DEFAULT_OTP_LENGTH = 8

export const PERSON_TYPES: (SegmentedOption & { value: PersonType })[] = [
  { value: 'natural', label: 'Natural' },
  { value: 'juridica', label: 'Jurídica' },
]

export const DOCUMENT_TYPES_BY_PERSON: Record<PersonType, { value: DocumentType; label: string }[]> = {
  natural: [
    { value: 'V', label: 'V · Venezolano' },
    { value: 'E', label: 'E · Extranjero' },
    { value: 'P', label: 'P · Pasaporte' },
  ],
  juridica: [
    { value: 'J', label: 'J · Jurídico' },
    { value: 'G', label: 'G · Gobierno' },
    { value: 'C', label: 'C · Comunal' },
  ],
}

/** Nombre del número según el documento: cédula, pasaporte o RIF. */
export const DOCUMENT_NUMBER_LABELS: Record<DocumentType, string> = {
  V: 'Número de cédula',
  E: 'Número de cédula',
  P: 'Número de pasaporte',
  J: 'Número de RIF',
  G: 'Número de RIF',
  C: 'Número de RIF',
}

export const IPG_PAYMENT_TEXT = {
  personTypeLegend: 'Tipo de persona',
  documentLegend: 'Documento de identidad',
  documentTypeLabel: 'Tipo de documento',
  documentHelpDigits: 'Solo números, sin puntos.',
  documentHelpPassport: 'Letras y números, sin espacios.',
  methodLegend: 'Método de pago',
  methodsLoading: 'Cargando los métodos de pago…',
  retry: 'Reintentar',
  payHint: 'Te pediremos un código de tu app BDV para confirmar.',
  pay: 'Pagar',
  total: 'Total',
  requesting: 'Enviando…',
  otpLegend: 'Código de confirmación',
  verify: 'Verificar código',
  verifying: 'Verificando…',
  editPayer: 'Corregir mis datos',
  approvedTitle: 'Pago aprobado',
  approvedText: 'El banco aprobó la operación.',
  deniedTitle: 'No se aprobó el pago',
  deniedFallback: 'El banco rechazó la operación. No se hizo ningún cargo.',
  unknownTitle: 'No pudimos confirmar tu pago',
  unknownText:
    'El banco no respondió a tiempo y el cargo pudo hacerse. Antes de volver a intentar, revisa tus movimientos en la app BDV para no pagar dos veces.',
  checkedRetry: 'Ya revisé, intentar de nuevo',
  operationNumber: 'N° de operación',
  amount: 'Monto',
  processedAt: 'Fecha',
  status: 'Estado',
  retryPayment: 'Intentar de nuevo',
  otherMethod: 'Elegir otro método',
}

export const IPG_PAYMENT_STATUS_LABELS: Record<IpgPaymentStatus, string> = {
  approved: 'Aprobada',
  denied: 'Rechazada',
  unknown: 'Por confirmar',
}

/** Mensaje de cada falla del Botón de Pago IPG. Ninguno culpa al conductor y todos dicen qué hacer. */
export const IPG_ERROR_MESSAGES: Record<Exclude<IpgErrorKind, 'otp_invalid'>, string> = {
  payer_rejected:
    'El banco no reconoce estos datos. Revisa el tipo de persona, el documento y el método de pago: deben ser los del titular de la cuenta o tarjeta.',
  method_unavailable: 'Este método de pago no está disponible ahora. Elige otro método e intenta de nuevo.',
  bank_unavailable: 'El Banco de Venezuela no responde en este momento. No se hizo ningún cargo. Intenta de nuevo en unos minutos.',
  payment_in_progress: 'Ya hay un pago en curso con estos datos. Espera un momento antes de volver a intentar.',
  otp_expired: 'El código venció. Toca «Pagar» para recibir uno nuevo en tu app BDV. No se hizo ningún cargo.',
  otp_blocked: 'Superaste los intentos para escribir el código. No se hizo ningún cargo. Toca «Pagar» para empezar de nuevo.',
  confirm_unknown: 'El banco no respondió a tiempo.',
}

/** «El código no es correcto. Te quedan 2 intentos.» */
export function ipgOtpInvalidMessage(attemptsLeft: number | null): string {
  if (attemptsLeft === null) return 'El código no es correcto. Revísalo en tu app BDV.'
  if (attemptsLeft === 1) return 'El código no es correcto. Te queda 1 intento.'
  return `El código no es correcto. Te quedan ${attemptsLeft} intentos.`
}

export const IPG_PROCESSOR_TEXT = 'Tu pago se procesa a través del Banco de Venezuela'

export const IPG_PAYMENT_MESSAGES = {
  documentRequired: 'Escribe el número de tu documento.',
  cedulaLength: 'La cédula lleva de 6 a 8 dígitos.',
  rifLength: 'El RIF lleva 9 dígitos, sin guiones.',
  passportLength: 'El pasaporte lleva de 5 a 12 letras o números.',
  methodRequired: 'Elige el método de pago.',
  methodsFailed: 'No pudimos cargar los métodos del Botón de Pago IPG.',
  requestFailed: 'No pudimos iniciar el pago. Vuelve a intentar en un momento.',
  otpIncomplete: (length: number) => `Escribe los ${length} dígitos del código.`,
  confirmFailed: 'No pudimos verificar el código. Vuelve a intentar.',
}

export function otpDigitLabel(position: number, total: number): string {
  return `Dígito ${position} de ${total}`
}

export function otpHelp(length: number): string {
  return `Son ${length} dígitos. Escríbelos sin espacios.`
}

/** Línea de resumen sobre el código: «Pagas Bs. 500,00 · Visa · V-•••5678». */
export function ipgPaymentSummary(amount: string, method: string, document: string): string {
  return [`Pagas ${amount}`, method, document].filter(Boolean).join(' · ')
}

/** Cómo se nombra cada dato pendiente en el aviso junto a «Pagar». */
export const IPG_PAYER_FIELD_LABELS: Record<IpgPayerField, string> = {
  documentNumber: 'tu número de documento',
  methodId: 'el método de pago',
}

/** «Falta: tu número de documento y el método de pago.» */
export function ipgMissingHint(fields: IpgPayerField[]): string {
  const labels = fields.map((f) => IPG_PAYER_FIELD_LABELS[f])
  const list = labels.length > 1 ? `${labels.slice(0, -1).join(', ')} y ${labels.at(-1)}` : (labels[0] ?? '')
  return `Falta: ${list}.`
}
