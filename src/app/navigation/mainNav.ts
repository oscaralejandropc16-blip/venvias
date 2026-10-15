import { PLATE_FORM_ANCHOR, ROUTE_NAMES } from '@/core/constants/routing'
import type { NavLink } from '@/core/types/Nav'

const balanceLink: NavLink = { to: { name: ROUTE_NAMES.balance }, label: 'Consultar saldo' }

/** Navegación pública: «Recargar» es la acción primaria; «Mi cuenta» es secundaria y va aparte. */
export const mainNavLinks: NavLink[] = [
  { to: { name: ROUTE_NAMES.home }, label: 'Inicio' },
  { to: { name: ROUTE_NAMES.recharge }, label: 'Recargar una placa' },
  { to: { name: ROUTE_NAMES.debt }, label: 'Pagar saldo deudor' },
  { to: { name: ROUTE_NAMES.howItWorks }, label: 'Cómo funciona' },
  { to: { name: ROUTE_NAMES.tolls }, label: 'Peajes habilitados' },
]

// La barra de escritorio no tiene sitio para un sexto enlace: «Consultar saldo» va en el menú móvil y el pie.
export const mobileNavLinks: NavLink[] = [mainNavLinks[0], mainNavLinks[1], balanceLink, ...mainNavLinks.slice(2)]

export const footerNavLinks: NavLink[] = [
  { to: { name: ROUTE_NAMES.recharge }, label: 'Recargar una placa' },
  balanceLink,
  { to: { name: ROUTE_NAMES.debt }, label: 'Pagar saldo deudor' },
  { to: { name: ROUTE_NAMES.howItWorks }, label: 'Cómo funciona' },
  { to: { name: ROUTE_NAMES.tolls }, label: 'Peajes habilitados' },
  { to: { name: ROUTE_NAMES.account }, label: 'Mi cuenta' },
]

export const navCtaLink: NavLink = {
  to: { name: ROUTE_NAMES.home, hash: `#${PLATE_FORM_ANCHOR}` },
  label: 'Recargar',
}

export const accountLink: NavLink = { to: { name: ROUTE_NAMES.account }, label: 'Mi cuenta' }
