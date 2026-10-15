/** Opción de monto tal como la entrega el backend (o su mock). */
export interface RechargeAmountOptionDto {
  id: string
  label: string
  /** Monto en la moneda de cobro; `null` mientras la tarifa no esté definida o en «Otro monto». */
  amount: number | null
  currency: string | null
  /** `true` en la opción en la que el conductor escribe el monto. */
  custom?: boolean
}
