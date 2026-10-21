import { describe, expect, it } from 'vitest'
import { mapRechargeAmountDtoToView } from '@/modules/recharge/mappers/rechargeAmount.mapper'
import { mapPaymentMethodDtoToView } from '@/modules/recharge/mappers/paymentMethod.mapper'
import { mapRechargeLimitsDtoToView } from '@/modules/recharge/mappers/rechargeLimits.mapper'
import { mapRechargeReceiptDtoToView } from '@/modules/recharge/mappers/rechargeReceipt.mapper'
import {
  createRecharge,
  getPaymentMethods,
  getRechargeAmountOptions,
  getRechargeLimits,
} from '@/modules/recharge/services/recharge.service'
import { useRechargeAmounts } from '@/modules/recharge/composables/useRechargeAmounts'
import { useRechargeFlow } from '@/modules/recharge/composables/useRechargeFlow'
import { parseAmount } from '@/modules/recharge/utils/amount'
import {
  RECHARGE_AMOUNT_MESSAGES,
  RECHARGE_PAY_MESSAGES,
  RECHARGE_CUSTOM_AMOUNT_DETAIL,
  RECHARGE_PENDING_AMOUNT,
} from '@/modules/recharge/constants/recharge'
import { PLATE_ERROR_MESSAGES } from '@/modules/plates/constants/plateEntry.messages'

const receiptDto = {
  reference: 'VV-1',
  plate: 'AB123CD',
  amount: 1250,
  fee: 0,
  total: 1250,
  balance_after: 1262.5,
  currency: 'Bs.',
  payment_method: 'ipg',
  security_code: '012345',
  paid_at: '2026-10-12T15:30:00Z',
}

describe('recharge · mappers', () => {
  it('un monto fijo se muestra corto y sin detalle', () => {
    expect(mapRechargeAmountDtoToView({ id: 'a', label: 'x', amount: 1000, currency: 'Bs.' })).toEqual({
      id: 'a',
      label: 'Bs. 1.000',
      detail: '',
      amount: 1000,
      custom: false,
    })
  })

  it('«Otro monto» lo elige el conductor y sin tarifa queda «Por definir»', () => {
    const custom = mapRechargeAmountDtoToView({ id: 'otro', label: 'Otro monto', amount: null, currency: null, custom: true })
    expect(custom).toMatchObject({ label: 'Otro monto', detail: RECHARGE_CUSTOM_AMOUNT_DETAIL, amount: null, custom: true })
    const pending = mapRechargeAmountDtoToView({ id: 'm', label: 'Monto 1', amount: null, currency: null })
    expect(pending).toMatchObject({ detail: RECHARGE_PENDING_AMOUNT, amount: null, custom: false })
  })

  it('los límites llevan sus montos formateados para los mensajes', () => {
    const limits = mapRechargeLimitsDtoToView({ min: 250, max: 10_000_000, step: 250, currency: 'Bs.', fee: 0 })
    expect([limits.minLabel, limits.maxLabel, limits.stepLabel]).toEqual(['Bs. 250,00', 'Bs. 10.000.000,00', 'Bs. 250,00'])
  })

  it('cada método de pago lleva su icono y uno desconocido usa el de tarjeta', () => {
    expect(mapPaymentMethodDtoToView({ id: 'mobile', name: 'Pago móvil', description: '' }).icon).toBe('rayo')
    expect(mapPaymentMethodDtoToView({ id: 'cripto', name: 'Otro', description: '' }).icon).toBe('tarjeta')
  })

  it('el comprobante formatea montos y fecha', () => {
    const receipt = mapRechargeReceiptDtoToView(receiptDto)
    expect(receipt).toMatchObject({
      amount: 'Bs. 1.250,00',
      fee: 'Bs. 0,00',
      total: 'Bs. 1.250,00',
      balanceAfter: 'Bs. 1.262,50',
      securityCode: '012345',
    })
    expect(receipt.paidAt).not.toBe('')
    expect(mapRechargeReceiptDtoToView({ ...receiptDto, paid_at: 'no es fecha' }).paidAt).toBe('')
  })
})

describe('recharge · service (mock)', () => {
  it('sirve montos, métodos y límites del mock adyacente', async () => {
    const [amounts, methods, limits] = await Promise.all([getRechargeAmountOptions(), getPaymentMethods(), getRechargeLimits()])
    expect(amounts.map((o) => o.amount)).toEqual([350, 500, 750, 1000, null])
    expect(amounts.at(-1)?.custom).toBe(true)
    expect(methods.map((m) => m.id)).toEqual(['ipg', 'mobile', 'transfer'])
    expect(limits).toMatchObject({ min: 350, max: 10_000_000, step: 50, currency: 'Bs.', fee: 0 })
  })

  it('createRecharge arma el comprobante y suma el monto al saldo de la placa', async () => {
    const receipt = await createRecharge({ plate: 'AB123CD', amount: 350, paymentMethod: 'ipg' })
    expect(receipt.reference).toMatch(/^VV-[A-Z0-9]+$/)
    expect(receipt.securityCode).toMatch(/^\d{6}$/)
    expect(receipt).toMatchObject({ plate: 'AB123CD', amount: 'Bs. 350,00', fee: 'Bs. 0,00', balanceAfter: 'Bs. 362,50' })
  })

  it('useRechargeAmounts sigue cargando las opciones del inicio', async () => {
    const { amountOptions, amountsLoading, fetchAmountOptions } = useRechargeAmounts()
    await fetchAmountOptions()
    expect(amountsLoading.value).toBe(false)
    expect(amountOptions.value).toHaveLength(5)
  })
})

describe('parseAmount', () => {
  it('lee montos en formato venezolano', () => {
    expect(parseAmount('1.000')).toBe(1000)
    expect(parseAmount('Bs. 2.500,50')).toBe(2500.5)
    expect(parseAmount('750')).toBe(750)
    expect(parseAmount('')).toBeNull()
    expect(parseAmount('abc')).toBeNull()
  })
})

describe('useRechargeFlow', () => {
  async function loadedFlow() {
    const flow = useRechargeFlow()
    await flow.loadOptions()
    return flow
  }

  it('al cargar elige el primer método de pago', async () => {
    const flow = await loadedFlow()
    expect(flow.paymentMethod.value).toBe('ipg')
  })

  it('valida el monto con las reglas del service: mínimo, máximo y múltiplo', async () => {
    const flow = await loadedFlow()
    expect(flow.validateAmount()).toBe(false)
    expect(flow.amountError.value).toBe(RECHARGE_AMOUNT_MESSAGES.required)

    const cases: [string, string][] = [
      ['100', RECHARGE_AMOUNT_MESSAGES.min('Bs. 350,00')],
      ['365', RECHARGE_AMOUNT_MESSAGES.step('Bs. 50,00')],
      ['20.000.000', RECHARGE_AMOUNT_MESSAGES.max('Bs. 10.000.000,00')],
    ]
    for (const [typed, message] of cases) {
      flow.setCustomAmount(typed)
      expect(flow.amountId.value).toBe('otro')
      expect(flow.validateAmount()).toBe(false)
      expect(flow.amountError.value).toBe(message)
    }

    flow.setCustomAmount('1.250')
    expect(flow.validateAmount()).toBe(true)
    expect(flow.amount.value).toBe(1250)

    flow.selectAmount('monto-2')
    expect(flow.amount.value).toBe(500)
    expect(flow.amountValid.value).toBe(true)
  })

  it('ignora un monto que no existe', async () => {
    const flow = await loadedFlow()
    flow.selectAmount('no-existe')
    expect(flow.amountId.value).toBe('')
  })

  it('arma el resumen con comisión y total', async () => {
    const flow = await loadedFlow()
    flow.setPlate('ac456ef')
    flow.selectAmount('monto-3')
    expect(flow.summary.value).toEqual({ plate: 'AC456EF', amount: 'Bs. 750,00', fee: 'Bs. 0,00', total: 'Bs. 750,00' })
  })

  it('no paga sin una placa válida', async () => {
    const flow = await loadedFlow()
    flow.selectAmount('monto-1')
    expect(await flow.pay()).toBeNull()
    expect(flow.plateError.value).toBe(PLATE_ERROR_MESSAGES.empty)
    expect(flow.receipt.value).toBeNull()
  })

  it('pay() arma el comprobante y suma al saldo; una placa nueva arranca en cero', async () => {
    const flow = await loadedFlow()
    flow.setPlate('XY987ZW')
    flow.selectAmount('monto-2')
    const receipt = await flow.pay()
    expect(receipt?.balanceAfter).toBe('Bs. 500,00')
    expect(flow.receipt.value).toEqual(receipt)
    expect(flow.paying.value).toBe(false)
  })

  it('restart deja el flujo como nuevo', async () => {
    const flow = await loadedFlow()
    flow.setPlate('AB123CD')
    flow.setCustomAmount('1.000')
    flow.selectPaymentMethod('transfer')
    await flow.pay()
    flow.restart()
    expect(flow.plate.value).toBe('')
    expect(flow.amountId.value).toBe('')
    expect(flow.customAmount.value).toBe('')
    expect(flow.paymentMethod.value).toBe('ipg')
    expect(flow.receipt.value).toBeNull()
  })

  it('con tarjeta: datos → código → aprobado arma el comprobante con el número de operación', async () => {
    const flow = await loadedFlow()
    flow.setPlate('CD456EF')
    flow.selectAmount('monto-2')
    expect(flow.ipgPayment.methods).toHaveLength(5)
    flow.ipgPayment.setDocumentNumber('12345678')
    flow.ipgPayment.selectMethod(3)

    expect(await flow.requestIpgOtp()).toBe(true)
    expect(flow.ipgPayment.stage).toBe('otp')
    flow.ipgPayment.setOtp('12345678')
    const receipt = await flow.confirmIpgOtp()

    expect(receipt).not.toBeNull()
    expect(receipt?.reference).toBe(flow.ipgPayment.result?.operationNumber)
    expect(receipt?.paymentMethod).toBe('ipg')
    expect(flow.receipt.value).toEqual(receipt)
  })

  it('con tarjeta rechazada no hay comprobante', async () => {
    const flow = await loadedFlow()
    flow.setPlate('CD456EF')
    flow.selectAmount('monto-1')
    flow.ipgPayment.setDocumentNumber('12345678')
    flow.ipgPayment.selectMethod(3)
    await flow.requestIpgOtp()
    flow.ipgPayment.setOtp('99999999')

    expect(await flow.confirmIpgOtp()).toBeNull()
    expect(flow.ipgPayment.result?.status).toBe('denied')
    expect(flow.receipt.value).toBeNull()
  })

  it('sin placa válida no pide el código', async () => {
    const flow = await loadedFlow()
    flow.selectAmount('monto-1')
    flow.ipgPayment.setDocumentNumber('12345678')
    flow.ipgPayment.selectMethod(3)
    expect(await flow.requestIpgOtp()).toBe(false)
    expect(flow.ipgPayment.stage).toBe('payer')
  })

  it('cambiar de método reinicia el pago con tarjeta', async () => {
    const flow = await loadedFlow()
    flow.setPlate('CD456EF')
    flow.selectAmount('monto-1')
    flow.ipgPayment.setDocumentNumber('12345678')
    flow.ipgPayment.selectMethod(3)
    await flow.requestIpgOtp()
    flow.selectPaymentMethod('mobile')
    expect(flow.ipgPayment.stage).toBe('payer')
    expect(flow.ipgPayment.documentNumber).toBe('')
    expect(flow.ipgPayment.methodId).toBeNull()
  })

  it('aprobado pero sin acreditar: el reintento acredita con la misma referencia, sin cobrar de nuevo', async () => {
    const flow = await loadedFlow()
    flow.setPlate('CD456EF')
    flow.selectAmount('monto-1')
    flow.ipgPayment.setDocumentNumber('12345678')
    flow.ipgPayment.selectMethod(3)
    await flow.requestIpgOtp()
    flow.ipgPayment.setOtp('33333333')

    expect(await flow.confirmIpgOtp()).toBeNull()
    expect(flow.ipgPayment.result?.status).toBe('approved')
    expect(flow.payError.value).toBe(RECHARGE_PAY_MESSAGES.settleFailed)
    expect(flow.receipt.value).toBeNull()

    const receipt = await flow.settleIpgRecharge()
    expect(receipt?.reference).toBe('000000000')
    expect(flow.payError.value).toBe('')
  })

  it('sin respuesta del banco al confirmar: no hay comprobante ni acreditación', async () => {
    const flow = await loadedFlow()
    flow.setPlate('CD456EF')
    flow.selectAmount('monto-1')
    flow.ipgPayment.setDocumentNumber('12345678')
    flow.ipgPayment.selectMethod(3)
    await flow.requestIpgOtp()
    flow.ipgPayment.setOtp('22222222')

    expect(await flow.confirmIpgOtp()).toBeNull()
    expect(flow.ipgPayment.result?.status).toBe('unknown')
    expect(flow.receipt.value).toBeNull()
    expect(await flow.settleIpgRecharge()).toBeNull()
  })
})
