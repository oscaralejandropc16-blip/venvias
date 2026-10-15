import type { IconName } from '@/shared/icons/iconPaths'

/** Método de pago listo para pintar. */
export interface PaymentMethodOption {
  id: string
  name: string
  description: string
  icon: IconName
}
