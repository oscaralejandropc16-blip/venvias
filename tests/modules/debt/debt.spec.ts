import { describe, expect, it } from 'vitest'
import { mapDebtSummaryDtoToView, mapDebtTransitDtoToView } from '@/modules/debt/mappers/debt.mapper'
import { inquireDebt, payMockDebt } from '@/modules/debt/services/debt.service'
import { useDebtInquiry } from '@/modules/debt/composables/useDebtInquiry'
import type { DebtSummaryDto } from '@/modules/debt/types/DebtSummaryDto'
import type { DebtTransitDto } from '@/modules/debt/types/DebtTransitDto'

const sampleTransitDto: DebtTransitDto = {
  id: 'tr-test-1',
  toll_name: 'Peaje Guacara',
  highway: 'ARC',
  state: 'Carabobo',
  passed_at: '2026-10-15T10:00:00Z',
  amount: 50,
  currency: 'Bs.',
  category: 'Liviano',
  status: 'PENDING',
  citation_number: 'CIT-001',
}

const sampleSummaryDto: DebtSummaryDto = {
  plate: 'AB123CD',
  total_debt: 50,
  currency: 'Bs.',
  transits_count: 1,
  status: 'DEBT_PENDING',
  transits: [sampleTransitDto],
}

describe('debt · mapper', () => {
  it('mapea correctamente un tránsito individual', () => {
    const transit = mapDebtTransitDtoToView(sampleTransitDto)
    expect(transit).toMatchObject({
      id: 'tr-test-1',
      tollName: 'Peaje Guacara',
      highway: 'ARC',
      state: 'Carabobo',
      amount: 50,
      amountFormatted: 'Bs. 50,00',
      category: 'Liviano',
      status: 'PENDING',
      statusLabel: 'Pendiente',
      statusTone: 'warning',
      citationNumber: 'CIT-001',
    })
  })

  it('mapea correctamente el resumen de deuda', () => {
    const summary = mapDebtSummaryDtoToView(sampleSummaryDto)
    expect(summary).toMatchObject({
      plate: 'AB123CD',
      totalDebt: 50,
      totalDebtFormatted: 'Bs. 50,00',
      transitsCount: 1,
      status: 'DEBT_PENDING',
      statusLabel: 'Tránsitos pendientes de pago',
      statusTone: 'warning',
    })
    expect(summary.transits).toHaveLength(1)
  })
})

describe('debt · service (mock)', () => {
  it('devuelve los tránsitos de una placa con deuda', async () => {
    const result = await inquireDebt('AB123CD')
    expect(result.totalDebt).toBeGreaterThan(0)
    expect(result.status).toBe('DEBT_PENDING')
    expect(result.transits.length).toBeGreaterThan(0)
  })

  it('devuelve saldo solvente para una placa sin deudas', async () => {
    const result = await inquireDebt('ZZ999ZZ')
    expect(result.totalDebt).toBe(0)
    expect(result.status).toBe('CLEAR')
    expect(result.transits).toHaveLength(0)
  })

  it('simula el pago de la deuda dejando la placa solvente', async () => {
    const paid = payMockDebt('AA000AA')
    expect(paid.totalDebt).toBe(0)
    expect(paid.status).toBe('CLEAR')
  })
})

describe('useDebtInquiry', () => {
  it('no consulta si la placa es inválida', async () => {
    const inquiry = useDebtInquiry()
    inquiry.setPlate('A1')
    expect(await inquiry.submit()).toBe(false)
    expect(inquiry.plateError.value).not.toBe('')
    expect(inquiry.debt.value).toBeNull()
  })

  it('consulta y carga la deuda con una placa válida', async () => {
    const inquiry = useDebtInquiry()
    inquiry.setPlate('AB123CD')
    expect(await inquiry.submit()).toBe(true)
    expect(inquiry.debt.value).not.toBeNull()
    expect(inquiry.debt.value?.plate).toBe('AB123CD')
  })

  it('permite pagar la deuda y actualiza el estado', async () => {
    const inquiry = useDebtInquiry()
    inquiry.setPlate('AB123CD')
    await inquiry.submit()
    expect(inquiry.hasDebt.value).toBe(true)

    const paidOk = await inquiry.payDebt()
    expect(paidOk).toBe(true)
    expect(inquiry.paidSuccess.value).toBe(true)
    expect(inquiry.hasDebt.value).toBe(false)
  })
})
