import type { DebtTransit } from './DebtTransit'

export type DebtStatus = 'CLEAR' | 'DEBT_PENDING' | 'DEBT_OVERDUE'

export interface DebtSummary {
  plate: string
  totalDebt: number
  totalDebtFormatted: string
  transitsCount: number
  status: DebtStatus
  statusLabel: string
  statusTone: 'success' | 'warning' | 'alert'
  transits: DebtTransit[]
}
