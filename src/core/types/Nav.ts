import type { RouteLocationRaw } from 'vue-router'

export interface NavLink {
  /** Destino del enlace. Un `hash` apunta a una sección de inicio. */
  to: RouteLocationRaw
  label: string
}
