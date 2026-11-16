// Iconografía del sistema: monolínea, trazo 2 px, esquinas redondeadas (viewBox 24×24).
export const ICON_PATHS = {
  menu: 'M4 7h16M4 12h16M4 17h10',
  close: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  chevron: 'M6 9l6 6 6-6',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  alert:
    'M12 8v5M12 16.5v.01M10.3 3.9L2.6 17.5A2 2 0 004.3 20.5h15.4a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z',
  info: 'M12 11v5M12 7.5v.01M12 21a9 9 0 100-18 9 9 0 000 18z',
  placa: 'M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM7 12h2M11 12h2M15 12h2M6 8h12',
  // Peaje: cabina con brazo de barrera rayado sobre la línea del suelo; legible desde 16 px.
  peaje: 'M2 21h20M4 21V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v12M9 11h11.5a1.5 1.5 0 0 1 0 3H9M13.5 11l-1.5 3M18 11l-1.5 3',
  rayo: 'M13 3L5 13.5h6L10 21l8-10.5h-6L13 3z',
  recibo: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6M9 16h3',
  carro:
    'M5 16V12l2-5h10l2 5v4M3 16h18v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1H7v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM5 12h14M7.5 14.5h.01M16.5 14.5h.01',
  camion: 'M2 6h12v10H2zM14 9h4l4 4v3h-8M6 18.5a1.5 1.5 0 100-.01M17 18.5a1.5 1.5 0 100-.01',
  tarjeta: 'M3 6h18v12H3zM3 10h18M7 15h4',
  audifonos: 'M4 15v-3a8 8 0 0116 0v3M4 15h3v5H5a1 1 0 01-1-1v-4zM20 15h-3v5h2a1 1 0 001-1v-4z',
  buscar: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35',
  billetera: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 13h4M2 11h20',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  impresora: 'M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z',
  documento: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
} as const

export type IconName = keyof typeof ICON_PATHS
