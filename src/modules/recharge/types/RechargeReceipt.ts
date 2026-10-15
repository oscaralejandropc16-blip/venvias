/** Lo que se envía para pagar una recarga. */
export interface RechargeRequest {
  plate: string
  amount: number
  paymentMethod: string
  /** Número de operación del cobro ya aprobado (Botón de Pago IPG); el comprobante lo usa como referencia. */
  paymentReference?: string
}

/** Comprobante de la recarga listo para pintar: los montos ya llevan su moneda. */
export interface RechargeReceipt {
  reference: string
  plate: string
  amount: string
  fee: string
  total: string
  balanceAfter: string
  paymentMethod: string
  /** Código de seis dígitos para consultar el saldo. */
  securityCode: string
  paidAt: string
}
