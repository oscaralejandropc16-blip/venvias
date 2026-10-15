import type { IconName } from '@/shared/icons/iconPaths'
import type { RechargeStep } from '../types/RechargeStep'

export const RECHARGE_PENDING_AMOUNT = 'Por definir'
export const RECHARGE_CUSTOM_AMOUNT_DETAIL = 'Tú eliges'

export const RECHARGE_STEPS: { id: RechargeStep; label: string }[] = [
  { id: 'plate', label: 'Placa' },
  { id: 'amount', label: 'Monto' },
  { id: 'payment', label: 'Pago' },
  { id: 'ready', label: 'Listo' },
]

export const RECHARGE_STEP_TEXT: Record<RechargeStep, { title: string; intro: string }> = {
  plate: {
    title: '¿Qué placa vas a recargar?',
    intro: 'Escribe la placa del vehículo que recibe el saldo.',
  },
  amount: {
    title: 'Elige el monto',
    intro: 'Toca un monto o escribe el tuyo.',
  },
  payment: {
    title: 'Confirma y paga',
    intro: 'Revisa los datos antes de pagar.',
  },
  ready: {
    title: 'Listo, ya puedes circular',
    intro: 'El saldo se descuenta solo al pasar por los peajes habilitados.',
  },
}

/** Título e intro del paso de pago según el subestado del Botón de Pago IPG. */
export const RECHARGE_IPG_STEP_TEXT = {
  otp: {
    title: 'Confirma con tu código',
    intro: 'Abre tu app BDV, genera el código y escríbelo aquí.',
  },
  denied: {
    title: 'No se aprobó el pago',
  },
  unknown: {
    title: 'No pudimos confirmar tu pago',
    intro:
      'El banco no respondió a tiempo y el cargo pudo hacerse. Antes de volver a intentar, revisa tus movimientos en la app BDV para no pagar dos veces.',
  },
  approved: {
    title: 'Tu pago se aprobó',
    intro: 'Falta acreditar el saldo a tu placa.',
  },
}

export const RECHARGE_TEXT = {
  progressLabel: 'Progreso de la recarga',
  stepDone: 'completado',
  back: 'Volver',
  changePlate: 'Cambiar placa',
  plateLabel: 'Placa',
  continue: 'Continuar',
  toPayment: 'Continuar al pago',
  paying: 'Procesando el pago…',
  amountLegend: '¿Cuánto quieres recargar?',
  customAmountLabel: 'Escribe el monto',
  customAmountPlaceholder: '0',
  methodLegend: '¿Cómo vas a pagar?',
  plateNotice: 'Verifica que la placa sea correcta. El saldo se acredita directo a esta placa.',
  noSignup: 'Sin registro. No te pedimos nombre, correo ni teléfono.',
  loading: 'Cargando las opciones de recarga…',
  retry: 'Reintentar',
  checkBalance: 'Consultar mi saldo',
  another: 'Recargar otra placa',
  retrySettle: 'Acreditar el saldo',
  totalToPay: 'Total a pagar',
  showDetail: 'Ver detalle del monto',
  hideDetail: 'Ocultar el detalle',
  methodChosen: 'Pagas con',
  changeMethod: 'Cambiar',
  changeMethodLabel: 'Cambiar el método de pago',
}

/** «Paso 3 de 4 · Pago», para la barra que acompaña el scroll. */
export function rechargeStepLabel(position: number, total: number, label: string): string {
  return `Paso ${position} de ${total} · ${label}`
}

export function rechargePayLabel(total: string): string {
  return `Pagar ${total}`
}

export function customAmountHint(min: string, max: string, step: string): string {
  return `Desde ${min} hasta ${max}, en múltiplos de ${step}.`
}

export const RECHARGE_SUMMARY_LABELS = {
  title: 'Resumen',
  plate: 'Placa',
  amount: 'Monto',
  fee: 'Comisión',
  total: 'Total',
}

export const RECHARGE_RECEIPT_TEXT = {
  title: 'Comprobante',
  credited: 'Se acreditaron',
  balanceAfter: 'Nuevo saldo',
  reference: 'Referencia',
  operationNumber: 'N° de operación',
  paidAt: 'Fecha',
  securityCode: 'Código de seguridad',
  securityCodeNote: 'Guárdalo para consultar tu saldo.',
}

export const RECHARGE_GUIDE = {
  eyebrow: 'Así de simple',
  title: 'Tu recarga, paso a paso',
  items: [
    { title: 'Indica la placa', description: 'Escribe la placa que recibe el saldo.' },
    { title: 'Elige el monto', description: 'Toca un monto o escribe el tuyo.' },
    { title: 'Confirma el pago', description: 'Revisa los datos y elige cómo pagar.' },
    { title: 'Circula', description: 'El saldo queda disponible para los peajes habilitados.' },
  ],
  note: 'Tu placa identifica el saldo. No necesitas crear una cuenta.',
}

export const RECHARGE_AMOUNT_MESSAGES = {
  required: 'Elige un monto o escribe uno.',
  min: (label: string) => `El monto mínimo de recarga es ${label}.`,
  max: (label: string) => `El monto máximo de recarga es ${label}.`,
  step: (label: string) => `El monto debe ser múltiplo de ${label}.`,
  unavailable: 'No pudimos cargar las reglas de la recarga. Vuelve a intentar.',
}

export const RECHARGE_PAY_MESSAGES = {
  methodRequired: 'Elige cómo vas a pagar.',
  failed: 'No pudimos procesar el pago. Vuelve a intentar en un momento.',
  settleFailed: 'Tu pago se aprobó, pero no pudimos acreditar el saldo. Vuelve a intentar: no se cobra de nuevo.',
}

export const RECHARGE_OPTIONS_ERROR = 'No pudimos cargar las opciones de recarga.'

/** Icono de cada método de pago; uno desconocido usa el de tarjeta. */
export const PAYMENT_METHOD_ICONS: Record<string, IconName> = {
  ipg: 'tarjeta',
  mobile: 'rayo',
  transfer: 'recibo',
}
export const DEFAULT_PAYMENT_METHOD_ICON: IconName = 'tarjeta'
