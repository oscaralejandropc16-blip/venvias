import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { errorMessage } from '@/core/utils/ErrorUtils'
import { usePlateEntry } from '@/modules/plates/composables/usePlateEntry'
import { BALANCE_MESSAGES, SECURITY_CODE_LENGTH } from '../constants/balance'
import { inquireBalance } from '../services/balance.service'
import type { WalletSummary } from '../types/WalletSummary'

export interface UseBalanceInquiryApi {
  plate: Ref<string>
  plateError: Ref<string>
  plateHint: Ref<string>
  plateValid: ComputedRef<boolean>
  code: Ref<string>
  codeError: Ref<string>
  codeComplete: ComputedRef<boolean>
  loading: Ref<boolean>
  error: Ref<string>
  wallet: Ref<WalletSummary | null>
  setPlate: (raw: string) => void
  setCode: (value: string) => void
  submit: () => Promise<boolean>
  reset: () => void
}

/**
 * Consulta de saldo por placa y código de seguridad. La placa sigue las reglas
 * de `usePlateEntry`; el código solo se revisa en formato antes de enviarlo.
 */
export function useBalanceInquiry(): UseBalanceInquiryApi {
  const entry = usePlateEntry()
  const code = ref('')
  const codeError = ref('')
  const loading = ref(false)
  const error = ref('')
  const wallet = ref<WalletSummary | null>(null)
  let loadToken = 0

  const codeComplete = computed(() => new RegExp(`^\\d{${SECURITY_CODE_LENGTH}}$`).test(code.value))

  function setPlate(raw: string): void {
    entry.applyInput(raw, raw.length)
  }

  function setCode(value: string): void {
    code.value = value
    codeError.value = ''
  }

  async function submit(): Promise<boolean> {
    const submission = entry.validate()
    if (!codeComplete.value) codeError.value = BALANCE_MESSAGES.codeIncomplete
    if (!submission || !codeComplete.value) return false

    const token = ++loadToken
    loading.value = true
    error.value = ''
    try {
      const result = await inquireBalance(submission.plate, code.value)
      if (token !== loadToken) return false
      wallet.value = result
      return true
    } catch (err) {
      if (token !== loadToken) return false
      error.value = errorMessage(err, BALANCE_MESSAGES.requestFailed)
      return false
    } finally {
      if (token === loadToken) loading.value = false
    }
  }

  function reset(): void {
    loadToken++
    loading.value = false
    entry.applyInput('', 0)
    code.value = ''
    codeError.value = ''
    error.value = ''
    wallet.value = null
  }

  return {
    plate: entry.plate,
    plateError: entry.error,
    plateHint: entry.hint,
    plateValid: entry.isValid,
    code,
    codeError,
    codeComplete,
    loading,
    error,
    wallet,
    setPlate,
    setCode,
    submit,
    reset,
  }
}
