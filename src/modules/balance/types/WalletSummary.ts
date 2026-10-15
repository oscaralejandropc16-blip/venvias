/** Estado de la billetera de una placa. */
export type WalletStatus = 'ACTIVE' | 'LOW_BALANCE' | 'ZERO_BALANCE' | 'BLOCKED' | 'REVIEW'

/** Cómo se pinta el estado: `ok` en azul con check, `low` en texto con info, `alert` en alerta. */
export type WalletStatusTone = 'ok' | 'low' | 'alert'

/** Saldo de una placa listo para pintar. */
export interface WalletSummary {
  plate: string
  /** Saldo disponible en la moneda de cobro. */
  balance: number
  /** Saldo con su moneda: «Bs. 12,50». */
  balanceLabel: string
  status: WalletStatus
  statusLabel: string
  statusTone: WalletStatusTone
}
