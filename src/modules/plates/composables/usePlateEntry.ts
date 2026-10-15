import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { PLATE_ERROR_MESSAGES, PLATE_FOREIGN_CHARS_HINT } from '../constants/plateEntry.messages'
import type { PlateChar, PlateInputChange, PlateIntent, PlateStatus, PlateSubmission } from '../types/Plate'
import { hasForeignChars, plateChars, plateInputChange, plateStatus } from '../utils/plate'

export interface UsePlateEntryApi {
  intent: Ref<PlateIntent>
  plate: Ref<string>
  amountId: Ref<string>
  error: Ref<string>
  hint: Ref<string>
  status: ComputedRef<PlateStatus>
  isValid: ComputedRef<boolean>
  chars: ComputedRef<PlateChar[]>
  setIntent: (next: PlateIntent) => boolean
  setAmount: (id: string) => void
  applyInput: (typed: string, cursor: number) => PlateInputChange
  validate: () => PlateSubmission | null
}

/**
 * Estado y reglas del formulario de placa: normaliza lo que se escribe,
 * decide los mensajes y arma la solicitud. No conoce el DOM ni el router:
 * el componente pinta y la vista decide a dónde ir.
 */
export function usePlateEntry(): UsePlateEntryApi {
  const intent = ref<PlateIntent>('recargar')
  const plate = ref('')
  const amountId = ref('')
  const error = ref('')
  const hint = ref('')

  const status = computed(() => plateStatus(plate.value))
  const isValid = computed(() => status.value === 'valid')
  const chars = computed(() => plateChars(plate.value))

  function setIntent(next: PlateIntent): boolean {
    if (next === intent.value) return false
    intent.value = next
    error.value = ''
    return true
  }

  function setAmount(id: string): void {
    amountId.value = id
  }

  function applyInput(typed: string, cursor: number): PlateInputChange {
    const change = plateInputChange(typed, cursor)
    hint.value = hasForeignChars(typed) ? PLATE_FOREIGN_CHARS_HINT : ''
    error.value = ''
    plate.value = change.value
    // Un monto elegido deja de valer si la placa vuelve a quedar incompleta.
    if (plateStatus(change.value) !== 'valid') amountId.value = ''
    return change
  }

  function validate(): PlateSubmission | null {
    const current = status.value
    if (current !== 'valid') {
      error.value = PLATE_ERROR_MESSAGES[current]
      return null
    }
    const submission: PlateSubmission = { intent: intent.value, plate: plate.value }
    if (intent.value === 'recargar' && amountId.value) submission.amountId = amountId.value
    return submission
  }

  return { intent, plate, amountId, error, hint, status, isValid, chars, setIntent, setAmount, applyInput, validate }
}
