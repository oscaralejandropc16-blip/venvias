import type { DebtTransitDto } from './DebtTransitDto'

export interface DebtSummaryDto {
  plate: string
  total_debt: number
  currency: string
  transits_count: number
  status: 'CLEAR' | 'DEBT_PENDING' | 'DEBT_OVERDUE'
  transits: DebtTransitDto[]
}
