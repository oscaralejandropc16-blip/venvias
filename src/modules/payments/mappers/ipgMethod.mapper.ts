import type { IpgMethod } from '../types/IpgMethod'
import type { IpgMethodDto } from '../types/IpgMethodDto'

export function mapIpgMethodDtoToView(dto: IpgMethodDto): IpgMethod {
  return {
    id: dto.id,
    name: dto.name,
    // Sin nombre corto, el resumen usa el completo.
    shortName: dto.shortName?.trim() || dto.name,
    detailType: dto.paymentDetailType ?? 0,
  }
}
