import { ROUTE_NAMES } from '@/core/constants/routing'
import type { FaqItem, HomeActionCardItem, SafetyItem } from '../types/Home'

export const HOME_HERO_CONTENT = {
  eyebrow: 'Sistema Nacional de Peajes',
  title: 'Paga tus peajes con tu placa.',
  titleHighlight: 'Sin registrarte.',
  subtitle:
    'Recarga saldo a tu vehículo, verifica tu saldo disponible o cancela tránsitos pendientes con cobro automático en los peajes habilitados.',
}

export const HOME_ACTION_CARDS: HomeActionCardItem[] = [
  {
    id: 'recargar',
    title: 'Recargar saldo',
    description:
      'Abona saldo directo a la placa de tu vehículo para transitar sin esperas por los canales de cobro automático.',
    icon: 'billetera',
    badge: 'Recomendado',
    buttonText: 'Recargar placa',
    route: { name: ROUTE_NAMES.recharge },
    primary: true,
  },
  {
    id: 'consultar',
    title: 'Consultar saldo',
    description:
      'Verifica el saldo disponible vinculado a tu matrícula y revisa el estado de tu cuenta prepagada al instante.',
    icon: 'buscar',
    buttonText: 'Consultar saldo',
    route: { name: ROUTE_NAMES.balance },
    primary: false,
  },
  {
    id: 'deuda',
    title: 'Pagar deuda',
    description:
      'Paga tránsitos pendientes si pasaste por un carril de peaje sin saldo disponible o sin dispositivo TAG.',
    icon: 'recibo',
    buttonText: 'Pagar deuda',
    route: { name: ROUTE_NAMES.debt },
    primary: false,
  },
]

export const SAFETY_ITEMS: SafetyItem[] = [
  { icon: 'placa', title: 'Solo te pedimos la placa', text: 'Para recargar no necesitas correo ni contraseña.' },
  { icon: 'check', title: 'Confirmas antes de pagar', text: 'Ves la placa y el monto antes de que se haga el cobro.' },
  { icon: 'recibo', title: 'Cada operación queda registrada', text: 'Cada recarga y cada pago llevan su referencia.' },
]

export const FAQS: FaqItem[] = [
  {
    q: '¿Necesito registrarme para recargar?',
    a: 'No. Solo necesitas la placa del vehículo. La cuenta es opcional y la puedes crear cuando quieras.',
  },
  {
    q: '¿Necesito un TAG?',
    a: 'No. Si ya tienes TAG, sigue usándolo: es la forma preferida de pasar. Si no tienes, tu placa basta.',
  },
  {
    q: '¿Qué pasa si paso por un peaje sin saldo?',
    a: 'La deuda queda registrada a esa placa. La consultas y la pagas en «Pagar saldo deudor».',
  },
  {
    q: '¿Y si escribo mal la placa?',
    a: 'Antes de pagar te mostramos la placa y el monto para que los confirmes. Si algo no cuadra, lo corriges ahí mismo.',
  },
  { q: '¿Dónde funciona?', a: 'En los peajes habilitados. Muy pronto publicamos la lista completa.' },
  { q: '¿Quién está detrás de VenVías?', a: 'VenVías es el servicio de pago por placa de Venezuela en Movimiento.' },
]

export const TAG_PHOTO_ALT = 'Vehículo en un carril de peaje con el TAG VenVías adherido al parabrisas'
