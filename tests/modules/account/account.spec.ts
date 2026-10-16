import { describe, expect, it } from 'vitest'
import {
  mapProfileDtoToView,
  mapTransitDtoToView,
  mapVehicleDtoToView,
} from '@/modules/account/mappers/account.mapper'
import { addMockVehicle, getAccountProfile } from '@/modules/account/services/account.service'
import { useAccountPortal } from '@/modules/account/composables/useAccountPortal'
import type {
  AccountProfileDto,
  AccountTransitDto,
  AccountVehicleDto,
} from '@/modules/account/types/AccountTypes'

const sampleVehicleDto: AccountVehicleDto = {
  plate: 'AB123CD',
  alias: 'Camioneta de Servicio',
  tag_id: 'TAG-001',
  tag_status: 'ACTIVE',
  balance: 200,
  currency: 'Bs.',
  auto_recharge: true,
}

const sampleTransitDto: AccountTransitDto = {
  id: 'tr-01',
  plate: 'AB123CD',
  toll_name: 'Peaje La Cabrera',
  highway: 'ARC',
  state: 'Carabobo',
  passed_at: '2026-10-15T12:00:00Z',
  amount: 50,
  currency: 'Bs.',
  status: 'PAID',
  method: 'TAG',
  receipt_number: 'REC-001',
}

const sampleProfileDto: AccountProfileDto = {
  id: 'acc-01',
  name: 'Empresa Demo C.A.',
  document_id: 'J-12345678-0',
  email: 'contacto@demo.com',
  phone: '0414-0000000',
  currency: 'Bs.',
  total_balance: 200,
  vehicles: [sampleVehicleDto],
  recent_transits: [sampleTransitDto],
}

describe('account · mapper', () => {
  it('mapea correctamente un vehículo de cuenta', () => {
    const v = mapVehicleDtoToView(sampleVehicleDto)
    expect(v).toMatchObject({
      plate: 'AB123CD',
      plateFormatted: 'AB123CD',
      alias: 'Camioneta de Servicio',
      tagId: 'TAG-001',
      tagStatus: 'ACTIVE',
      tagStatusLabel: 'TAG Activo',
      tagStatusTone: 'success',
      balance: 200,
      balanceFormatted: 'Bs. 200,00',
      autoRecharge: true,
    })
  })

  it('mapea correctamente un tránsito registrado', () => {
    const t = mapTransitDtoToView(sampleTransitDto)
    expect(t).toMatchObject({
      id: 'tr-01',
      plate: 'AB123CD',
      tollName: 'Peaje La Cabrera',
      amount: 50,
      amountFormatted: 'Bs. 50,00',
      status: 'PAID',
      statusLabel: 'Debitado con éxito',
      statusTone: 'success',
      methodLabel: 'TAG VenVías',
      receiptNumber: 'REC-001',
    })
  })

  it('mapea el perfil consolidado y calcula los conteos', () => {
    const profile = mapProfileDtoToView(sampleProfileDto)
    expect(profile).toMatchObject({
      name: 'Empresa Demo C.A.',
      documentId: 'J-12345678-0',
      vehiclesCount: 1,
      activeTagsCount: 1,
      totalBalance: 200,
      totalBalanceFormatted: 'Bs. 200,00',
    })
    expect(profile.vehicles).toHaveLength(1)
    expect(profile.recentTransits).toHaveLength(1)
  })
})

describe('account · service (mock)', () => {
  it('obtiene el perfil por defecto con vehículos', async () => {
    const profile = await getAccountProfile()
    expect(profile.vehicles.length).toBeGreaterThanOrEqual(1)
    expect(profile.totalBalance).toBeGreaterThanOrEqual(0)
  })

  it('permite asociar un nuevo vehículo al perfil', async () => {
    const updated = await addMockVehicle('XY999ZZ', 'Vehículo de Prueba')
    const found = updated.vehicles.find((v) => v.plate === 'XY999ZZ')
    expect(found).toBeDefined()
    expect(found?.alias).toBe('Vehículo de Prueba')
  })
})

describe('useAccountPortal', () => {
  it('permite cambiar pestañas y cargar perfil', async () => {
    const portal = useAccountPortal()
    expect(portal.activeTab.value).toBe('vehicles')

    portal.setActiveTab('transits')
    expect(portal.activeTab.value).toBe('transits')

    await portal.fetchProfile()
    expect(portal.profile.value).not.toBeNull()
  })

  it('registra un vehículo reactivamente', async () => {
    const portal = useAccountPortal()
    await portal.fetchProfile()
    const initialCount = portal.profile.value?.vehiclesCount ?? 0

    const ok = await portal.registerVehicle('ZZ111AA', 'Unidad de Carga')
    expect(ok).toBe(true)
    expect(portal.profile.value?.vehiclesCount).toBe(initialCount + 1)
  })
})
