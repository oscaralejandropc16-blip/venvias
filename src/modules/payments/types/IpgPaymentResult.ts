/** `unknown`: el banco no respondió al confirmar; el cargo pudo hacerse o no. */
export type IpgPaymentStatus = 'approved' | 'denied' | 'unknown'

/** Resultado del cobro listo para pintar: el monto ya lleva su moneda. */
export interface IpgPaymentResult {
  status: IpgPaymentStatus
  operationNumber: string
  amount: string
  processedAt: string
  /** Motivo del banco cuando se rechaza; vacío si no lo da. */
  reason: string
}
