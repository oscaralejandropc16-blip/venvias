/** Método de pago del Botón de Pago IPG (cuenta de ahorro, corriente o tarjeta) listo para pintar. */
export interface IpgMethod {
  id: number
  /** Nombre completo: «Cta. de Ahorro», «Crédito Visa». */
  name: string
  /** Nombre corto para resúmenes: «Ahorro», «Visa». */
  shortName: string
  /** Datos adicionales que pide el método; hoy todos llegan en 0 (significado por confirmar con el banco). */
  detailType: number
}
