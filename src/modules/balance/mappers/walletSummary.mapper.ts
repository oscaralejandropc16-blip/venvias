import { formatMoney } from '@/core/utils/money'
import { WALLET_STATUS_LABELS, WALLET_STATUS_TONES } from '../constants/balance'
import type { WalletStatus, WalletSummary } from '../types/WalletSummary'
import type { WalletSummaryDto } from '../types/WalletSummaryDto'

function toStatus(raw: string): WalletStatus {
  return raw in WALLET_STATUS_LABELS ? (raw as WalletStatus) : 'REVIEW'
}

export function mapWalletSummaryDtoToView(dto: WalletSummaryDto): WalletSummary {
  const status = toStatus(dto.status)
  return {
    plate: dto.plate,
    balance: dto.balance,
    balanceLabel: formatMoney(dto.balance, dto.currency),
    status,
    statusLabel: WALLET_STATUS_LABELS[status],
    statusTone: WALLET_STATUS_TONES[status],
  }
}
