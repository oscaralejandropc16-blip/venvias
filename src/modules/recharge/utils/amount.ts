/**
 * Lee el monto que escribe el conductor en formato venezolano: el punto separa
 * miles y la coma, decimales («1.000,50» → 1000.5). `null` si no hay número.
 */
export function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/[^\d.,]/g, '')
  if (!/\d/.test(cleaned)) return null
  const value = Number(cleaned.replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(value) ? value : null
}
