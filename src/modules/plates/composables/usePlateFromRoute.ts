import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { normalizePlate, plateStatus } from '../utils/plate'

export interface UsePlateFromRouteApi {
  plate: ComputedRef<string>
  hasPlate: ComputedRef<boolean>
}

/** Placa que llega en `?placa=` desde el formulario del hero, ya normalizada. */
export function usePlateFromRoute(): UsePlateFromRouteApi {
  const route = useRoute()
  const plate = computed(() => normalizePlate(String(route.query.placa ?? '')))
  const hasPlate = computed(() => plateStatus(plate.value) === 'valid')
  return { plate, hasPlate }
}
