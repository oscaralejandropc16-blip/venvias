import { DEFAULT_PAYMENT_METHOD_ICON, PAYMENT_METHOD_ICONS } from '../constants/recharge'
import type { PaymentMethodOption } from '../types/PaymentMethodOption'
import type { PaymentMethodOptionDto } from '../types/PaymentMethodOptionDto'

export function mapPaymentMethodDtoToView(dto: PaymentMethodOptionDto): PaymentMethodOption {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    icon: PAYMENT_METHOD_ICONS[dto.id] ?? DEFAULT_PAYMENT_METHOD_ICON,
  }
}
