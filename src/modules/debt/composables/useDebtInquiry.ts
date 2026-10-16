import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { errorMessage } from '@/core/utils/ErrorUtils'
import { usePlateEntry } from '@/modules/plates/composables/usePlateEntry'
import { inquireDebt, payMockDebt } from '../services/debt.service'
import type { DebtSummary } from '../types/DebtSummary'

export interface UseDebtInquiryApi {
  plate: Ref<string>
  plateError: Ref<string>
  plateHint: Ref<string>
  plateValid: ComputedRef<boolean>
  loading: Ref<boolean>
  paying: Ref<boolean>
  error: Ref<string>
  debt: Ref<DebtSummary | null>
  hasDebt: ComputedRef<boolean>
  paidSuccess: Ref<boolean>
  setPlate: (raw: string) => void
  submit: () => Promise<boolean>
  payDebt: () => Promise<boolean>
  reset: () => void
}

export function useDebtInquiry(): UseDebtInquiryApi {
  const entry = usePlateEntry()
  const loading = ref(false)
  const paying = ref(false)
  const error = ref('')
  const debt = ref<DebtSummary | null>(null)
  const paidSuccess = ref(false)
  let loadToken = 0

  const hasDebt = computed(() => !!debt.value && debt.value.totalDebt > 0)

  function setPlate(raw: string): void {
    entry.applyInput(raw, raw.length)
  }

  async function submit(): Promise<boolean> {
    const submission = entry.validate()
    if (!submission) return false

    const token = ++loadToken
    loading.value = true
    error.value = ''
    paidSuccess.value = false
    try {
      const result = await inquireDebt(submission.plate)
      if (token !== loadToken) return false
      debt.value = result
      return true
    } catch (err) {
      if (token !== loadToken) return false
      error.value = errorMessage(err, 'No se pudo consultar el registro de deudas. Intenta nuevamente.')
      return false
    } finally {
      if (token === loadToken) loading.value = false
    }
  }

  async function payDebt(): Promise<boolean> {
    if (!debt.value || debt.value.totalDebt <= 0) return false
    paying.value = true
    error.value = ''
    try {
      const updated = payMockDebt(debt.value.plate)
      debt.value = updated
      paidSuccess.value = true
      return true
    } catch (err) {
      error.value = errorMessage(err, 'No se pudo procesar el pago de la deuda.')
      return false
    } finally {
      paying.value = false
    }
  }

  function reset(): void {
    loadToken++
    loading.value = false
    paying.value = false
    entry.applyInput('', 0)
    error.value = ''
    debt.value = null
    paidSuccess.value = false
  }

  return {
    plate: entry.plate,
    plateError: entry.error,
    plateHint: entry.hint,
    plateValid: entry.isValid,
    loading,
    paying,
    error,
    debt,
    hasDebt,
    paidSuccess,
    setPlate,
    submit,
    payDebt,
    reset,
  }
}
