/**
 * Service de Cuenta y Flotillas.
 * Sirve el perfil de usuario y la lista de vehículos asociados.
 */

import { hasApiBackend, httpClient } from '@/core/api/httpClient'
import { mapProfileDtoToView } from '../mappers/account.mapper'
import type { AccountProfile, AccountProfileDto, AccountTransitDto, AccountVehicleDto } from '../types/AccountTypes'
import accountMock from './account.mock.json'

const PATHS = {
  profile: '/public/account/profile/',
  addVehicle: '/public/account/vehicles/',
}

// Clon reactivo en memoria para simular altas de vehículos durante la sesión
let currentProfileDto: AccountProfileDto = {
  ...accountMock.profile,
  currency: accountMock.currency,
  vehicles: accountMock.profile.vehicles.map((v) => ({ ...v, currency: accountMock.currency })) as AccountVehicleDto[],
  recent_transits: accountMock.profile.recent_transits.map((t) => ({ ...t, currency: accountMock.currency })) as AccountTransitDto[],
}

export async function getAccountProfile(): Promise<AccountProfile> {
  const dto = hasApiBackend
    ? await httpClient.get<AccountProfileDto>(PATHS.profile)
    : currentProfileDto

  return mapProfileDtoToView(dto)
}

export async function addMockVehicle(plate: string, alias: string): Promise<AccountProfile> {
  const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const newVehicle: AccountVehicleDto = {
    plate: normalized,
    alias: alias.trim() || 'Vehículo Adicional',
    tag_status: 'INACTIVE',
    balance: 0,
    currency: accountMock.currency,
    auto_recharge: false,
  }

  currentProfileDto = {
    ...currentProfileDto,
    vehicles: [newVehicle, ...currentProfileDto.vehicles],
  }

  return mapProfileDtoToView(currentProfileDto)
}
