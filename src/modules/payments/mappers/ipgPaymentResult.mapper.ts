import { formatMoney } from '@/core/utils/money'
import type { IpgPaymentResult } from '../types/IpgPaymentResult'
import type { IpgPaymentResultDto } from '../types/IpgPaymentResultDto'

const PROCESSED_AT_FORMAT = new Intl.DateTimeFormat('es-VE', { dateStyle: 'medium', timeStyle: 'short' })

export function mapIpgPaymentResultDtoToView(dto: IpgPaymentResultDto): IpgPaymentResult {
  const processedAt = new Date(dto.processed_at)
  return {
    status: dto.status === 'approved' ? 'approved' : 'denied',
    operationNumber: dto.operation_number,
    amount: formatMoney(dto.amount, dto.currency),
    processedAt: Number.isNaN(processedAt.getTime()) ? '' : PROCESSED_AT_FORMAT.format(processedAt),
    reason: dto.reason?.trim() ?? '',
  }
}
