import { ROUTE_NAMES } from '@/core/constants/routing'
import type { HowItWorksSlide } from '../types/Home'

import recarga from '@/assets/how-it-works/1-recarga.webp'
import recargaSm from '@/assets/how-it-works/1-recarga-900.webp'
import camara from '@/assets/how-it-works/2-camara.webp'
import camaraSm from '@/assets/how-it-works/2-camara-900.webp'
import placaZoom from '@/assets/how-it-works/2-camara-placa.webp'
import porticos from '@/assets/how-it-works/3-sin-detenerte.webp'
import porticosSm from '@/assets/how-it-works/3-sin-detenerte-900.webp'
import deuda from '@/assets/how-it-works/4-deuda.webp'
import deudaSm from '@/assets/how-it-works/4-deuda-900.webp'

export const HOW_IT_WORKS_SLIDES: HowItWorksSlide[] = [
  {
    title: 'Recarga tu placa.',
    stop: 'Recarga',
    subtitle: 'Acredita tu saldo',
    text: 'Antes de salir de viaje, recarga saldo a la placa de tu vehículo.',
    points: [
      'Desde la web o la app móvil.',
      'Sin crear una cuenta: solo necesitas tu placa.',
      'El saldo queda disponible al instante.',
    ],
    img: recarga,
    imgSm: recargaSm,
    alt: 'Conductor llega al peaje VenVías por el carril central, con la recarga confirmada en el teléfono del tablero.',
  },
  {
    title: 'La cámara lee tu placa.',
    stop: 'Lectura',
    subtitle: 'Cámara ALPR óptica',
    text: 'Al pasar por el peaje, una cámara ALPR captura tu placa. No tienes que detenerte: sigue a la velocidad máxima autorizada dentro del peaje.',
    img: camara,
    imgSm: camaraSm,
    alt: 'El carro se acerca por el carril y la cámara junto a la barrera, alineada con el carril, lo mira de frente.',
    zoom: { img: placaZoom, alt: 'Acercamiento a la placa delantera AB123CD que lee la cámara.' },
  },
  {
    title: 'Pasa sin detenerte.',
    stop: 'Pasa',
    subtitle: 'Tránsito continuo',
    text: 'No paras en la cabina de cobro: el peaje se debita automáticamente del saldo de tu placa.',
    points: [
      'Carril VenVías: barrera arriba y luz verde.',
      'El tránsito fluye sin colas frente a la cabina.',
      'Menos tiempo de viaje en cada peaje.',
    ],
    img: porticos,
    imgSm: porticosSm,
    alt: 'El carro ya pasó la barrera, que sigue arriba junto a la cámara, y continúa sin detenerse.',
  },
  {
    title: '¿Sin saldo o sin TAG?',
    stop: 'Sin saldo',
    subtitle: 'Gestión de cobro',
    text:
        'Si pasas por un carril Expreso sin un método de pago válido (TAG o Placa con saldo), el tránsito queda como deuda. ',
    points: [
      'La deuda es la tarifa del peaje más cargos administrativos.',
      'Queda asociada a la placa hasta que sea cancelada.',
    ],
    note: {
      strong: 'La obligación de pago del peaje nace con la utilización efectiva de la infraestructura vial ' +
          'y su pago puede ser exigido en cualquiera de las estaciones de peaje al momento de transitar.',
      text: 'La obligación de pago se atribuye al propietario registrado, según el artículo 72 de la Ley de Tránsito y Transporte Terrestre',
    },
    img: deuda,
    imgSm: deudaSm,
    alt: 'Al anochecer, el carro sale del peaje VenVías con las luces encendidas; el saldo deudor queda registrado a su placa.',
    invoice: { plate: 'ABCD123', status: 'Por pagar' },
    cta: { to: { name: ROUTE_NAMES.debt }, label: 'Pagar saldo deudor' },
    more: { to: { name: ROUTE_NAMES.debtConditions }, label: 'Ver condiciones' },
  },
]
