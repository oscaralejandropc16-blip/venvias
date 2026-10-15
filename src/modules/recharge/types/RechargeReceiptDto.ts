/** Comprobante de la recarga tal como lo entrega el backend (o su mock). */
export interface RechargeReceiptDto {
  reference: string
  plate: string
  amount: number
  fee: number
  total: number
  balance_after: number
  currency: string
  payment_method: string
  security_code: string
  /** Fecha y hora del pago en ISO 8601. */
  paid_at: string
}
