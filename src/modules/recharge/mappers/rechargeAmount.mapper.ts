import { formatMoney } from '@/core/utils/money'
import { RECHARGE_CUSTOM_AMOUNT_DETAIL, RECHARGE_PENDING_AMOUNT } from '../constants/recharge'
import type { RechargeAmountOption } from '../types/RechargeAmountOption'
import type { RechargeAmountOptionDto } from '../types/RechargeAmountOptionDto'

export function mapRechargeAmountDtoToView(dto: RechargeAmountOptionDto): RechargeAmountOption {
  const custom = dto.custom === true
  if (!custom && dto.amount !== null && dto.currency !== null) {
    return { id: dto.id, label: formatMoney(dto.amount, dto.currency, 0), detail: '', amount: dto.amount, custom }
  }
  return {
    id: dto.id,
    label: dto.label,
    detail: custom ? RECHARGE_CUSTOM_AMOUNT_DETAIL : RECHARGE_PENDING_AMOUNT,
    amount: null,
    custom,
  }
}
