/**
 * Nombres de ruta públicos. Las vistas, la navegación y los composables los
 * importan desde aquí: nunca escriben el literal.
 */
export const ROUTE_NAMES = {
  home: 'home',
  howItWorks: 'how-it-works',
  recharge: 'recharge',
  balance: 'query-balance',
  debt: 'outstanding-debt',
  debtConditions: 'terms-and-conditions',
  tolls: 'tolls',
  account: 'account',
  notFound: 'not-found',
} as const

export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]

/** Ancla del formulario de placa en el hero de inicio. */
export const PLATE_FORM_ANCHOR = 'recargar'

/** Ancla de la sección «Cómo funciona» en inicio. */
export const HOW_IT_WORKS_ANCHOR = 'como-funciona'

/** Alto de la barra de navegación fija que el scroll a un ancla debe librar. */
export const STICKY_NAV_OFFSET = 72
