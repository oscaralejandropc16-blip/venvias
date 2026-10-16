import { ref, type Ref } from 'vue'
import { errorMessage } from '@/core/utils/ErrorUtils'
import { addMockVehicle, getAccountProfile } from '../services/account.service'
import type { AccountProfile } from '../types/AccountTypes'

export type AccountTabKey = 'vehicles' | 'transits' | 'statements' | 'alerts'

export interface UseAccountPortalApi {
  profile: Ref<AccountProfile | null>
  loading: Ref<boolean>
  addingVehicle: Ref<boolean>
  error: Ref<string>
  activeTab: Ref<AccountTabKey>
  fetchProfile: () => Promise<void>
  registerVehicle: (plate: string, alias: string) => Promise<boolean>
  setActiveTab: (tab: AccountTabKey) => void
}

export function useAccountPortal(): UseAccountPortalApi {
  const profile = ref<AccountProfile | null>(null)
  const loading = ref(false)
  const addingVehicle = ref(false)
  const error = ref('')
  const activeTab = ref<AccountTabKey>('vehicles')

  async function fetchProfile(): Promise<void> {
    loading.value = true
    error.value = ''
    try {
      profile.value = await getAccountProfile()
    } catch (err) {
      error.value = errorMessage(err, 'No se pudo cargar el perfil de la cuenta.')
    } finally {
      loading.value = false
    }
  }

  async function registerVehicle(plate: string, alias: string): Promise<boolean> {
    if (!plate) return false
    addingVehicle.value = true
    error.value = ''
    try {
      profile.value = await addMockVehicle(plate, alias)
      return true
    } catch (err) {
      error.value = errorMessage(err, 'No se pudo registrar el nuevo vehículo.')
      return false
    } finally {
      addingVehicle.value = false
    }
  }

  function setActiveTab(tab: AccountTabKey): void {
    activeTab.value = tab
  }

  return {
    profile,
    loading,
    addingVehicle,
    error,
    activeTab,
    fetchProfile,
    registerVehicle,
    setActiveTab,
  }
}
