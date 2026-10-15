import { ref, type Ref } from 'vue'
import { errorMessage } from '@/core/utils/ErrorUtils'
import { getRechargeAmountOptions } from '../services/recharge.service'
import type { RechargeAmountOption } from '../types/RechargeAmountOption'

export interface UseRechargeAmountsApi {
  amountOptions: Ref<RechargeAmountOption[]>
  amountsLoading: Ref<boolean>
  amountsError: Ref<string>
  fetchAmountOptions: () => Promise<void>
}

export function useRechargeAmounts(): UseRechargeAmountsApi {
  const amountOptions = ref<RechargeAmountOption[]>([])
  const amountsLoading = ref(false)
  const amountsError = ref('')
  let loadToken = 0

  async function fetchAmountOptions(): Promise<void> {
    const token = ++loadToken
    amountsLoading.value = true
    amountsError.value = ''
    try {
      const items = await getRechargeAmountOptions()
      if (token !== loadToken) return
      amountOptions.value = items
    } catch (err) {
      if (token !== loadToken) return
      amountsError.value = errorMessage(err, 'No pudimos cargar los montos de recarga.')
    } finally {
      if (token === loadToken) amountsLoading.value = false
    }
  }

  return { amountOptions, amountsLoading, amountsError, fetchAmountOptions }
}
