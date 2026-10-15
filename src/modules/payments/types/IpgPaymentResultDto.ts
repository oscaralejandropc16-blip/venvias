/** Resultado del cobro tal como lo entrega el backend (o su mock). */
export interface IpgPaymentResultDto {
  status: 'approved' | 'denied'
  operation_number: string
  amount: number
  currency: string
  /** Fecha y hora del cobro en ISO 8601. */
  processed_at: string
  reason?: string | null
}
