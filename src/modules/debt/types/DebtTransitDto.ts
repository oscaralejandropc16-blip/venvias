export interface DebtTransitDto {
  id: string
  toll_name: string
  highway: string
  state: string
  passed_at: string
  amount: number
  currency: string
  category: string
  status: 'PENDING' | 'OVERDUE' | 'PAID'
  citation_number?: string
}
