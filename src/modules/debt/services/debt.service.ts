/**
 * Service de deudas y tránsitos pendientes.
 * Es la única capa que conoce los paths de la API y los DTOs.
 * Mientras no haya backend sirve el mock adyacente.
 */

import { hasApiBackend, httpClient } from '@/core/api/httpClient'
import { mapDebtSummaryDtoToView } from '../mappers/debt.mapper'
import type { DebtSummary } from '../types/DebtSummary'
import type { DebtSummaryDto } from '../types/DebtSummaryDto'
import debtMock from './debt.mock.json'

const PATHS = {
  debtInquiry: (plate: string) => `/public/plates/${encodeURIComponent(plate)}/debt/`,
  debtPay: (plate: string) => `/public/plates/${encodeURIComponent(plate)}/debt/pay/`,
}

// Copia en memoria del mock para simular pagos durante la sesión
const mockDebts = new Map<string, DebtSummaryDto>(
  (debtMock.debts as DebtSummaryDto[]).map((d) => [d.plate, { ...d, currency: debtMock.currency }]),
)

function getMockDebt(plate: string): DebtSummaryDto {
  const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, '')
  return (
    mockDebts.get(normalized) ?? {
      plate: normalized,
      total_debt: 0,
      currency: debtMock.currency,
      transits_count: 0,
      status: 'CLEAR',
      transits: [],
    }
  )
}

/** Consulta la deuda y tránsitos pendientes asociados a una placa vehicular. */
export async function inquireDebt(plate: string): Promise<DebtSummary> {
  const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const dto = hasApiBackend
    ? await httpClient.get<DebtSummaryDto>(PATHS.debtInquiry(normalized), {
        silentStatuses: [404],
      })
    : getMockDebt(normalized)

  return mapDebtSummaryDtoToView(dto)
}

/** Simula el pago de la deuda completa para una placa en modo mock. */
export function payMockDebt(plate: string): DebtSummary {
  const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const current = getMockDebt(normalized)
  const paid: DebtSummaryDto = {
    ...current,
    total_debt: 0,
    transits_count: 0,
    status: 'CLEAR',
    transits: current.transits.map((t) => ({ ...t, status: 'PAID' })),
  }
  mockDebts.set(normalized, paid)
  return mapDebtSummaryDtoToView(paid)
}
