import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Estado transversal entre el hero de inicio y la barra de navegación.
 *
 * En el móvil, la nav muestra su propio «Recargar» solo cuando la placa del
 * hero no está a la vista. `null` = todavía no se sabe (antes de que el
 * observador responda): la nav no lo muestra para no parpadear.
 */
export const useHeroStore = defineStore('hero', () => {
  const plateInView = ref<boolean | null>(null)

  function setPlateInView(value: boolean | null): void {
    plateInView.value = value
  }

  return { plateInView, setPlateInView }
})
