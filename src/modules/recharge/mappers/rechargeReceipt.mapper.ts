import { formatMoney } from '@/core/utils/money'
import type { RechargeReceipt } from '../types/RechargeReceipt'
import type { RechargeReceiptDto } from '../types/RechargeReceiptDto'

const PAID_AT_FORMAT = new Intl.DateTimeFormat('es-VE', { dateStyle: 'medium', timeStyle: 'short' })

export function mapRechargeReceiptDtoToView(dto: RechargeReceiptDto): RechargeReceipt {
  const money = (value: number) => formatMoney(value, dto.currency)
  const paidAt = new Date(dto.paid_at)
  return {
    reference: dto.reference,
    plate: dto.plate,
    amount: money(dto.amount),
    fee: money(dto.fee),
    total: money(dto.total),
    balanceAfter: money(dto.balance_after),
    paymentMethod: dto.payment_method,
    securityCode: dto.security_code,
    paidAt: Number.isNaN(paidAt.getTime()) ? '' : PAID_AT_FORMAT.format(paidAt),
  }
}
