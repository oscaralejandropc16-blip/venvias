import { ref, type Ref } from 'vue'
import { errorMessage } from '@/core/utils/ErrorUtils'
import { RECHARGE_OPTIONS_ERROR } from '../constants/recharge'
import { getPaymentMethods, getRechargeAmountOptions, getRechargeLimits } from '../services/recharge.service'
import type { PaymentMethodOption } from '../types/PaymentMethodOption'
import type { RechargeAmountOption } from '../types/RechargeAmountOption'
import type { RechargeLimits } from '../types/RechargeLimits'

export interface UseRechargeOptionsApi {
  amountOptions: Ref<RechargeAmountOption[]>
  paymentMethods: Ref<PaymentMethodOption[]>
  limits: Ref<RechargeLimits | null>
  optionsLoading: Ref<boolean>
  optionsError: Ref<string>
  fetchOptions: () => Promise<void>
}

/** Montos, métodos de pago y reglas de la recarga, cargados en paralelo. */
export function useRechargeOptions(): UseRechargeOptionsApi {
  const amountOptions = ref<RechargeAmountOption[]>([])
  const paymentMethods = ref<PaymentMethodOption[]>([])
  const limits = ref<RechargeLimits | null>(null)
  const optionsLoading = ref(false)
  const optionsError = ref('')
  let loadToken = 0

  async function fetchOptions(): Promise<void> {
    const token = ++loadToken
    optionsLoading.value = true
    optionsError.value = ''
    try {
      const [amounts, methods, rules] = await Promise.all([
        getRechargeAmountOptions(),
        getPaymentMethods(),
        getRechargeLimits(),
      ])
      if (token !== loadToken) return
      amountOptions.value = amounts
      paymentMethods.value = methods
      limits.value = rules
    } catch (err) {
      if (token !== loadToken) return
      optionsError.value = errorMessage(err, RECHARGE_OPTIONS_ERROR)
    } finally {
      if (token === loadToken) optionsLoading.value = false
    }
  }

  return { amountOptions, paymentMethods, limits, optionsLoading, optionsError, fetchOptions }
}
