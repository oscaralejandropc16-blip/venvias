/** Saldo de una placa tal como lo entrega el backend (o su mock). */
export interface WalletSummaryDto {
  plate: string
  balance: number
  currency: string
  /** Estado de la billetera; un valor desconocido se trata como `REVIEW`. */
  status: string
}
