export type VehicleTagStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_INSTALL'

export interface AccountVehicleDto {
  plate: string
  alias: string
  tag_id?: string
  tag_status: VehicleTagStatus
  balance: number
  currency: string
  auto_recharge: boolean
}

export interface AccountTransitDto {
  id: string
  plate: string
  toll_name: string
  highway: string
  state: string
  passed_at: string
  amount: number
  currency: string
  status: 'PAID' | 'EXEMPT' | 'PENDING'
  method: 'TAG' | 'PLATE'
  receipt_number: string
}

export interface AccountProfileDto {
  id: string
  name: string
  document_id: string
  email: string
  phone: string
  currency: string
  total_balance: number
  vehicles: AccountVehicleDto[]
  recent_transits: AccountTransitDto[]
}

export interface AccountVehicle {
  plate: string
  plateFormatted: string
  alias: string
  tagId?: string
  tagStatus: VehicleTagStatus
  tagStatusLabel: string
  tagStatusTone: 'success' | 'warning' | 'alert'
  balance: number
  balanceFormatted: string
  autoRecharge: boolean
}

export interface AccountTransit {
  id: string
  plate: string
  plateFormatted: string
  tollName: string
  highway: string
  state: string
  passedAt: string
  passedAtFormatted: string
  amount: number
  amountFormatted: string
  status: 'PAID' | 'EXEMPT' | 'PENDING'
  statusLabel: string
  statusTone: 'success' | 'warning' | 'alert'
  methodLabel: string
  receiptNumber: string
}

export interface AccountProfile {
  id: string
  name: string
  documentId: string
  email: string
  phone: string
  totalBalance: number
  totalBalanceFormatted: string
  vehiclesCount: number
  activeTagsCount: number
  vehicles: AccountVehicle[]
  recentTransits: AccountTransit[]
}
