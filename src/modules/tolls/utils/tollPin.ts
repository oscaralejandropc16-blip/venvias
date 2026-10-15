import { ICON_PATHS, type IconName } from '@/shared/icons/iconPaths'

/**
 * Marcador de peaje: gota roja con un círculo blanco que lleva el icono de peaje
 * (cabina con barrera, del sistema de iconos). Se devuelve como SVG en texto para el `divIcon` de Leaflet.
 */
export const TOLL_PIN_SIZE = { width: 40, height: 52 } as const

/** Grupo de peajes cercanos: dos gotas rojas apiladas con el conteo en el círculo. */
export const TOLL_CLUSTER_SIZE = { width: 48, height: 52 } as const

const DROP = 'M20 50C17 45.5 3 31 3 19a17 17 0 0 1 34 0c0 12-14 26.5-17 31z'

// La pintura base va en el propio SVG: el marcador se ve completo aunque su CSS no haya cargado.
// El CSS del mapa solo añade estados (hover, seleccionado, foco).
const PAINT = {
  drop: 'fill:var(--rojo-sistema);stroke:#fff;stroke-width:2',
  back: 'fill:var(--rojo-sistema);fill-opacity:0.55;stroke:#fff;stroke-width:2',
  disc: 'fill:#fff',
  icon: 'fill:none;stroke:var(--rojo-sistema);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round',
  count: 'fill:var(--rojo-sistema);font:500 14px var(--font-mono)',
}

/** Círculo blanco centrado en la cabeza de la gota. */
const DISC = '<circle cx="20" cy="19" r="12" style="PAINT_DISC"/>'.replace('PAINT_DISC', PAINT.disc)

export function tollPinSvg(): string {
  // El icono (24×24) se escala a ~16px; sube 1.6px porque su dibujo cae en la mitad baja de la caja.
  return `<svg class="toll-pin__svg" viewBox="0 0 40 52" width="40" height="52" aria-hidden="true" focusable="false">
  <path class="toll-pin__halo-edge" style="fill:none" d="${DROP}"/>
  <path class="toll-pin__halo" style="fill:none" d="${DROP}"/>
  <path style="${PAINT.drop}" d="${DROP}"/>
  ${DISC}
  <path style="${PAINT.icon}" transform="translate(12 9.4) scale(0.6667)" d="${ICON_PATHS.peaje}"/>
</svg>`
}

export function tollClusterHtml(count: number): string {
  return `<svg class="toll-cluster__svg" viewBox="0 0 48 52" width="48" height="52" aria-hidden="true" focusable="false">
  <path style="${PAINT.back}" transform="translate(8 -2)" d="${DROP}"/>
  <path style="${PAINT.drop}" d="${DROP}"/>
  ${DISC}
  <text style="${PAINT.count}" x="20" y="19" text-anchor="middle" dominant-baseline="central">${count}</text>
</svg>`
}

/** Icono del sistema como SVG en texto, para controles que Leaflet dibuja fuera de Vue. */
export function iconSvg(name: IconName, size = 20): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${ICON_PATHS[name]}"/></svg>`
}
