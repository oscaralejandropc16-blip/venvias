import { formatMoney } from '@/core/utils/money'
import { formatPlate } from '@/modules/plates/utils/plate'
import {
  ACCOUNT_TRANSIT_STATUS_LABELS,
  ACCOUNT_TRANSIT_STATUS_TONES,
  VEHICLE_TAG_STATUS_LABELS,
  VEHICLE_TAG_STATUS_TONES,
} from '../constants/account'
import type {
  AccountProfile,
  AccountProfileDto,
  AccountTransit,
  AccountTransitDto,
  AccountVehicle,
  AccountVehicleDto,
  VehicleTagStatus,
} from '../types/AccountTypes'

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return d.toLocaleString('es-VE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function mapVehicleDtoToView(dto: AccountVehicleDto): AccountVehicle {
  const status: VehicleTagStatus = dto.tag_status in VEHICLE_TAG_STATUS_LABELS ? dto.tag_status : 'INACTIVE'
  return {
    plate: dto.plate,
    plateFormatted: formatPlate(dto.plate),
    alias: dto.alias,
    tagId: dto.tag_id,
    tagStatus: status,
    tagStatusLabel: VEHICLE_TAG_STATUS_LABELS[status],
    tagStatusTone: VEHICLE_TAG_STATUS_TONES[status],
    balance: dto.balance,
    balanceFormatted: formatMoney(dto.balance, dto.currency),
    autoRecharge: dto.auto_recharge,
  }
}

export function mapTransitDtoToView(dto: AccountTransitDto): AccountTransit {
  const status = dto.status in ACCOUNT_TRANSIT_STATUS_LABELS ? dto.status : 'PAID'
  return {
    id: dto.id,
    plate: dto.plate,
    plateFormatted: formatPlate(dto.plate),
    tollName: dto.toll_name,
    highway: dto.highway,
    state: dto.state,
    passedAt: dto.passed_at,
    passedAtFormatted: formatDate(dto.passed_at),
    amount: dto.amount,
    amountFormatted: formatMoney(dto.amount, dto.currency),
    status: status as 'PAID' | 'EXEMPT' | 'PENDING',
    statusLabel: ACCOUNT_TRANSIT_STATUS_LABELS[status],
    statusTone: ACCOUNT_TRANSIT_STATUS_TONES[status],
    methodLabel: dto.method === 'TAG' ? 'TAG VenVías' : 'Cámara / Placa',
    receiptNumber: dto.receipt_number,
  }
}

export function mapProfileDtoToView(dto: AccountProfileDto): AccountProfile {
  const vehicles = (dto.vehicles ?? []).map(mapVehicleDtoToView)
  const activeTagsCount = vehicles.filter((v) => v.tagStatus === 'ACTIVE').length
  return {
    id: dto.id,
    name: dto.name,
    documentId: dto.document_id,
    email: dto.email,
    phone: dto.phone,
    totalBalance: dto.total_balance,
    totalBalanceFormatted: formatMoney(dto.total_balance, dto.currency),
    vehiclesCount: vehicles.length,
    activeTagsCount,
    vehicles,
    recentTransits: (dto.recent_transits ?? []).map(mapTransitDtoToView),
  }
}
