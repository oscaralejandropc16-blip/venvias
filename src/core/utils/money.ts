/** Monto con su moneda en formato venezolano: `formatMoney(1250, 'Bs.')` → «Bs. 1.250,00». */
export function formatMoney(amount: number, currency: string, fractionDigits = 2): string {
  const value = amount.toLocaleString('es-VE', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
  return `${currency} ${value}`
}
