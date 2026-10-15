import type { FaqItem, SafetyItem } from '../types/Home'

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
