export type DebtTransitStatus = 'PENDING' | 'OVERDUE' | 'PAID'

export interface DebtTransit {
  id: string
  tollName: string
  highway: string
  state: string
  passedAt: string
  passedAtFormatted: string
  amount: number
  amountFormatted: string
  category: string
  status: DebtTransitStatus
  statusLabel: string
  statusTone: 'warning' | 'alert' | 'success'
  citationNumber?: string
}
