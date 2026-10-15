import type { Toll } from '../types/Toll'
import type { TollDto } from '../types/TollDto'

export function mapTollDtoToView(dto: TollDto): Toll {
  return {
    id: dto.id,
    name: dto.name,
    state: dto.state,
    road: dto.road ?? '',
    lat: dto.latitude,
    lng: dto.longitude,
  }
}
