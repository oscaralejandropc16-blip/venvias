import { formatMoney } from '@/core/utils/money'
import {
  DEBT_STATUS_LABELS,
  DEBT_STATUS_TONES,
  TRANSIT_STATUS_LABELS,
  TRANSIT_STATUS_TONES,
} from '../constants/debt'
import type { DebtStatus, DebtSummary } from '../types/DebtSummary'
import type { DebtSummaryDto } from '../types/DebtSummaryDto'
import type { DebtTransit, DebtTransitStatus } from '../types/DebtTransit'
import type { DebtTransitDto } from '../types/DebtTransitDto'

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

export function mapDebtTransitDtoToView(dto: DebtTransitDto): DebtTransit {
  const status: DebtTransitStatus = dto.status in TRANSIT_STATUS_LABELS ? dto.status : 'PENDING'
  return {
    id: dto.id,
    tollName: dto.toll_name,
    highway: dto.highway,
    state: dto.state,
    passedAt: dto.passed_at,
    passedAtFormatted: formatDate(dto.passed_at),
    amount: dto.amount,
    amountFormatted: formatMoney(dto.amount, dto.currency),
    category: dto.category,
    status,
    statusLabel: TRANSIT_STATUS_LABELS[status],
    statusTone: TRANSIT_STATUS_TONES[status],
    citationNumber: dto.citation_number,
  }
}

export function mapDebtSummaryDtoToView(dto: DebtSummaryDto): DebtSummary {
  const status: DebtStatus = dto.status in DEBT_STATUS_LABELS ? dto.status : 'CLEAR'
  return {
    plate: dto.plate,
    totalDebt: dto.total_debt,
    totalDebtFormatted: formatMoney(dto.total_debt, dto.currency),
    transitsCount: dto.transits_count,
    status,
    statusLabel: DEBT_STATUS_LABELS[status],
    statusTone: DEBT_STATUS_TONES[status],
    transits: (dto.transits ?? []).map(mapDebtTransitDtoToView),
  }
}
