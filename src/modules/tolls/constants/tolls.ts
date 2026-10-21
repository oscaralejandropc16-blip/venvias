export const TOLLS_TEXT = {
  title: 'Peajes habilitados',
  intro: 'Pasa por cualquiera de estos peajes y el saldo de tu placa se descuenta solo, sin detenerte.',
  listLabel: 'Peajes habilitados por estado',
  statesTitle: 'Peajes por estado',
  mapLabel: 'Mapa de peajes habilitados',
  mapHintTouch: 'Usa dos dedos para mover el mapa.',
  roadPending: 'Vía por confirmar',
  roadsNote: 'Autopistas y troncales por confirmar.',
  zoomIn: 'Acercar',
  zoomOut: 'Alejar',
  closePopup: 'Cerrar',
  loading: 'Cargando peajes…',
  retry: 'Reintentar',
  emptyTitle: 'Lista en preparación',
  emptyDescription: 'La publicamos apenas esté confirmada.',
  emptyAction: 'Ver peajes',
  stubNext: 'La lista oficial de peajes se publica cuando esté confirmada.',
}

/** «10 peajes en 5 estados», con singular cuando toca. */
export function tollsCountLabel(tolls: number, states: number): string {
  const t = tolls === 1 ? '1 peaje' : `${tolls} peajes`
  const s = states === 1 ? '1 estado' : `${states} estados`
  return `${t} en ${s}`
}

/** «3 peajes» en la cabecera de la tarjeta de un estado. */
export function tollsInStateLabel(count: number): string {
  return count === 1 ? '1 peaje' : `${count} peajes`
}

/** Teselas de OpenStreetMap. Solo para el prototipo: producción necesita su propio proveedor. */
export const TOLLS_MAP = {
  tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  subdomains: 'abc',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
  focusZoom: 12,
  fitPadding: 30,
  clusterRadius: 36,
}

/** Nombre accesible del disco que agrupa peajes cercanos. */
export function tollsClusterLabel(names: string[]): string {
  return `${names.length} peajes: ${names.join(', ')}. Acercar para verlos.`
}
