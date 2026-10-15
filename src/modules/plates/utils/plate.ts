import type { PlateChar, PlateInputChange, PlateStatus } from '../types/Plate'

// Reglas provisionales: el formato oficial de placa (motos, carga, formatos
// anteriores) sigue abierto. Mientras tanto se acepta el formato actual de
// carro (AB123CD) y cualquier combinación de 6 o 7 letras y números.
export const PLATE_MAX = 7
export const PLATE_MIN = 6

export function normalizePlate(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, PLATE_MAX)
}

// La placa se muestra sin agrupar: AB123CD
export function formatPlate(value: string): string {
  return value
}

export function plateStatus(value: string): PlateStatus {
  if (!value) return 'empty'
  if (value.length < PLATE_MIN) return 'short'
  if (!/[A-Z]/.test(value) || !/[0-9]/.test(value)) return 'invalid'
  return 'valid'
}

/** `true` si lo escrito trae algo que no es letra, número, espacio o guion. */
export function hasForeignChars(raw: string): boolean {
  return /[^A-Za-z0-9\s-]/.test(raw)
}

export function plateChars(value: string): PlateChar[] {
  return [...value].map((ch, i) => ({ ch, key: `${i}-${ch}` }))
}

/** Normaliza lo escrito y ubica el cursor tras lo que quedaba antes de él. */
export function plateInputChange(typed: string, cursor: number): PlateInputChange {
  return { value: normalizePlate(typed), caret: normalizePlate(typed.slice(0, cursor)).length }
}
