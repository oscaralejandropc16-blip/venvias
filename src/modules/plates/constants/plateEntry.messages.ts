import type { PlateIntent, PlateStatus } from '../types/Plate'

export const PLATE_ERROR_MESSAGES: Record<Exclude<PlateStatus, 'valid'>, string> = {
  empty: 'Escribe la placa del vehículo para continuar.',
  short: 'A esta placa le faltan caracteres. Revísala y vuelve a intentar.',
  invalid: 'Una placa lleva letras y números. Revisa lo que escribiste.',
}

export const PLATE_FOREIGN_CHARS_HINT = 'La placa solo lleva letras y números.'

export const PLATE_PROMPTS: Record<PlateIntent, string> = {
  recargar: 'Escribe la placa de tu vehículo',
  deuda: 'Escribe la placa que vas a consultar',
}

export const PLATE_SUBMIT_LABELS: Record<PlateIntent, string> = {
  recargar: 'Recargar mi placa',
  deuda: 'Ver saldo deudor',
}

export const PLATE_INTENT_OPTIONS: { value: PlateIntent; label: string }[] = [
  { value: 'recargar', label: 'Recargar' },
  { value: 'deuda', label: 'Pagar saldo deudor' },
]

/** Placa de ejemplo que se dibuja cuando no hay una real (AB123CD). */
export const SAMPLE_PLATE = 'AB123CD'

export function plateReadyLabel(formatted: string): string {
  return `Placa ${formatted} lista`
}

export function plateImageLabel(formatted: string): string {
  return `Placa ${formatted}`
}
