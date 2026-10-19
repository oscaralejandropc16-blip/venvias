import { ROUTE_NAMES } from '@/core/constants/routing'
import type { NavLink } from '@/core/types/Nav'

/** Navegación pública principal de VenVías */
export const mainNavLinks: NavLink[] = [
  { to: { name: ROUTE_NAMES.home }, label: 'Inicio' },
  { to: { name: ROUTE_NAMES.recharge }, label: 'Recargar una placa' },
  { to: { name: ROUTE_NAMES.debt }, label: 'Pagar saldo deudor' },
  { to: { name: ROUTE_NAMES.howItWorks }, label: 'Cómo funciona' },
  { to: { name: ROUTE_NAMES.tolls }, label: 'Peajes habilitados' },
]

export const mobileNavLinks: NavLink[] = [
  ...mainNavLinks,
]

export const footerNavLinks: NavLink[] = [
  { to: { name: ROUTE_NAMES.recharge }, label: 'Recargar una placa' },
  { to: { name: ROUTE_NAMES.debt }, label: 'Pagar saldo deudor' },
  { to: { name: ROUTE_NAMES.howItWorks }, label: 'Cómo funciona' },
  { to: { name: ROUTE_NAMES.tolls }, label: 'Peajes habilitados' },
  { to: { name: ROUTE_NAMES.account }, label: 'Mi cuenta' },
]

export const navCtaLink: NavLink = {
  to: { name: ROUTE_NAMES.recharge },
  label: 'Recargar una placa',
}

export const accountLink: NavLink = { to: { name: ROUTE_NAMES.account }, label: 'Mi cuenta' }
