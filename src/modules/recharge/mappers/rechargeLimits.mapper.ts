import { formatMoney } from '@/core/utils/money'
import type { RechargeLimits } from '../types/RechargeLimits'
import type { RechargeLimitsDto } from '../types/RechargeLimitsDto'

export function mapRechargeLimitsDtoToView(dto: RechargeLimitsDto): RechargeLimits {
  return {
    min: dto.min,
    max: dto.max,
    step: dto.step,
    currency: dto.currency,
    fee: dto.fee,
    minLabel: formatMoney(dto.min, dto.currency),
    maxLabel: formatMoney(dto.max, dto.currency),
    stepLabel: formatMoney(dto.step, dto.currency),
  }
}
