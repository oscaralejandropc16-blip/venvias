/**
 * Service de peajes habilitados. El mock trae los 10 peajes de
 * specs/available-toll-sites.md (estado, nombre y coordenadas). La vía
 * (autopista o troncal) es un borrador sin verificar: la UI la marca como
 * «por confirmar» hasta que llegue del backend. Nunca se inventan peajes.
 */

import { hasApiBackend, httpClient } from '@/core/api/httpClient'
import { mapTollDtoToView } from '../mappers/toll.mapper'
import type { Toll } from '../types/Toll'
import type { TollDto } from '../types/TollDto'
import tollsMock from './tolls.mock.json'

const PATHS = {
  list: '/public/tolls/',
}

interface TollListDto {
  items: TollDto[]
}

export async function getEnabledTolls(): Promise<Toll[]> {
  const response = hasApiBackend
    ? await httpClient.get<TollListDto>(PATHS.list)
    : (tollsMock as TollListDto)
  return response.items.map(mapTollDtoToView)
}
