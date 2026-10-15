import { ref, type Ref } from 'vue'
import { errorMessage } from '@/core/utils/ErrorUtils'
import { getEnabledTolls } from '../services/tolls.service'
import type { Toll } from '../types/Toll'

export interface UseTollsListApi {
  tolls: Ref<Toll[]>
  tollsLoading: Ref<boolean>
  tollsError: Ref<string>
  fetchTolls: () => Promise<void>
}

export function useTollsList(): UseTollsListApi {
  const tolls = ref<Toll[]>([])
  const tollsLoading = ref(false)
  const tollsError = ref('')
  let loadToken = 0

  async function fetchTolls(): Promise<void> {
    const token = ++loadToken
    tollsLoading.value = true
    tollsError.value = ''
    try {
      const items = await getEnabledTolls()
      if (token !== loadToken) return
      tolls.value = items
    } catch (err) {
      if (token !== loadToken) return
      tollsError.value = errorMessage(err, 'No pudimos cargar la lista de peajes.')
    } finally {
      if (token === loadToken) tollsLoading.value = false
    }
  }

  return { tolls, tollsLoading, tollsError, fetchTolls }
}
