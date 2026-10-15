import { describe, expect, it } from 'vitest'
import { mapIpgMethodDtoToView } from '@/modules/payments/mappers/ipgMethod.mapper'
import { mapIpgOtpChallengeDtoToView } from '@/modules/payments/mappers/ipgOtpChallenge.mapper'
import { mapIpgPaymentResultDtoToView } from '@/modules/payments/mappers/ipgPaymentResult.mapper'
import {
  confirmIpgPayment,
  getIpgMethods,
  requestIpgPayment,
} from '@/modules/payments/services/ipgPayment.service'
import { useIpgPayment } from '@/modules/payments/composables/useIpgPayment'
import {
  DEFAULT_OTP_LENGTH,
  IPG_ERROR_MESSAGES,
  IPG_PAYMENT_MESSAGES,
  ipgMethodLogo,
  ipgMissingHint,
  ipgOtpInvalidMessage,
} from '@/modules/payments/constants/ipgPayment'
import type { IpgCharge } from '@/modules/payments/types/IpgCharge'
import type { IpgPayer } from '@/modules/payments/types/IpgPayer'

const charge: IpgCharge = { amount: 500, currency: 'Bs.', concept: { type: 'recharge', reference: 'AB123CD' } }
const payer: IpgPayer = {
  personType: 'natural',
  documentType: 'V',
  documentNumber: '12345678',
  methodId: 3,
}

describe('payments · mappers', () => {
  it('el emisor pasa id y nombre', () => {
    expect(mapIpgMethodDtoToView({ id: 3, name: 'Crédito Visa', shortName: 'Visa', paymentDetailType: 0 })).toEqual({
      id: 3,
      name: 'Crédito Visa',
      shortName: 'Visa',
      detailType: 0,
    })
    expect(mapIpgMethodDtoToView({ id: 9, name: 'Cta. Nueva', shortName: ' ', paymentDetailType: 0 }).shortName).toBe(
      'Cta. Nueva',
    )
  })

  it('el reto usa los dígitos del banco o, si faltan, los de por defecto', () => {
    expect(mapIpgOtpChallengeDtoToView({ challenge_id: 'c1', otp_length: 6 })).toEqual({ challengeId: 'c1', otpLength: 6 })
    expect(mapIpgOtpChallengeDtoToView({ challenge_id: 'c1' }).otpLength).toBe(DEFAULT_OTP_LENGTH)
    expect(mapIpgOtpChallengeDtoToView({ challenge_id: 'c1', otp_length: 0 }).otpLength).toBe(DEFAULT_OTP_LENGTH)
  })

  it('el resultado formatea monto y fecha, y limpia el motivo', () => {
    const result = mapIpgPaymentResultDtoToView({
      status: 'denied',
      operation_number: '000123456',
      amount: 500,
      currency: 'Bs.',
      processed_at: '2026-10-13T14:32:00Z',
      reason: '  Fondos insuficientes  ',
    })
    expect(result).toMatchObject({ status: 'denied', operationNumber: '000123456', amount: 'Bs. 500,00', reason: 'Fondos insuficientes' })
    expect(result.processedAt).not.toBe('')
    const approved = mapIpgPaymentResultDtoToView({
      status: 'approved',
      operation_number: '1',
      amount: 1,
      currency: 'Bs.',
      processed_at: 'no es fecha',
    })
    expect(approved).toMatchObject({ processedAt: '', reason: '' })
  })
})

describe('payments · service (mock)', () => {
  it('sirve los emisores del mock', async () => {
    const methods = await getIpgMethods()
    expect(methods.map((m) => m.id)).toEqual([1, 2, 3, 4, 21])
    expect(methods.map((m) => m.name)).toEqual([
      'Cta. de Ahorro',
      'Cta. Corriente',
      'Crédito Visa',
      'Crédito Mastercard',
      'Mastercard Digital',
    ])
  })

  it('un código cualquiera se aprueba con el monto cobrado', async () => {
    const challenge = await requestIpgPayment(payer, charge)
    expect(challenge.otpLength).toBe(8)
    const result = await confirmIpgPayment(challenge.challengeId, '12345678')
    expect(result).toMatchObject({ status: 'approved', amount: 'Bs. 500,00', reason: '' })
    expect(result.operationNumber).toMatch(/^\d{9}$/)
  })

  it('un código de puros nueves se rechaza con motivo', async () => {
    const challenge = await requestIpgPayment(payer, charge)
    const result = await confirmIpgPayment(challenge.challengeId, '99999999')
    expect(result.status).toBe('denied')
    expect(result.reason).not.toBe('')
  })

  it('un reto ya usado no se confirma dos veces', async () => {
    const challenge = await requestIpgPayment(payer, charge)
    await confirmIpgPayment(challenge.challengeId, '12345678')
    await expect(confirmIpgPayment(challenge.challengeId, '12345678')).rejects.toThrow()
  })
})

describe('useIpgPayment', () => {
  async function filled() {
    const card = useIpgPayment()
    await card.loadMethods()
    card.setDocumentNumber('12.345.678')
    card.selectMethod(3)
    return card
  }

  it('cambiar el tipo de persona cambia los documentos y reinicia tipo y número', async () => {
    const card = await filled()
    expect(card.documentTypes.value.map((d) => d.value)).toEqual(['V', 'E', 'P'])
    card.setPersonType('juridica')
    expect(card.documentTypes.value.map((d) => d.value)).toEqual(['J', 'G', 'C'])
    expect(card.documentType.value).toBe('J')
    expect(card.documentNumber.value).toBe('')
    card.setDocumentType('V')
    expect(card.documentType.value).toBe('J')
  })

  it('payerValid exige documento válido y emisor; los errores salen al tocar el campo', async () => {
    const card = useIpgPayment()
    await card.loadMethods()
    expect(card.payerValid.value).toBe(false)
    card.setDocumentNumber('123')
    expect(card.fieldErrors.value.documentNumber).toBe('')
    card.touch('documentNumber')
    expect(card.fieldErrors.value.documentNumber).toBe(IPG_PAYMENT_MESSAGES.cedulaLength)
    card.setDocumentNumber('12345678')
    expect(card.fieldErrors.value.documentNumber).toBe('')
    expect(card.payerValid.value).toBe(false)
    card.selectMethod(99)
    expect(card.methodId.value).toBeNull()
    card.selectMethod(4)
    expect(card.payerValid.value).toBe(true)
  })

  it('con datos incompletos no pide el código y marca los errores', async () => {
    const card = useIpgPayment()
    await card.loadMethods()
    expect(await card.requestOtp(charge)).toBe(false)
    expect(card.stage.value).toBe('payer')
    expect(card.fieldErrors.value).toEqual({
      documentNumber: IPG_PAYMENT_MESSAGES.documentRequired,
      methodId: IPG_PAYMENT_MESSAGES.methodRequired,
    })
  })

  it('recorre los subestados: datos → código → resultado', async () => {
    const card = await filled()
    expect(await card.requestOtp(charge)).toBe(true)
    expect(card.stage.value).toBe('otp')
    expect(card.challenge.value?.otpLength).toBe(8)
    expect(card.maskedDocument.value).toBe('V-•••5678')
    expect(card.methodName.value).toBe('Visa')

    expect(await card.confirmOtp()).toBeNull()
    expect(card.otpError.value).toBe(IPG_PAYMENT_MESSAGES.otpIncomplete(8))

    card.setOtp('1234-5678-90')
    expect(card.otp.value).toBe('12345678')
    expect(card.otpComplete.value).toBe(true)
    const result = await card.confirmOtp()
    expect(result?.status).toBe('approved')
    expect(card.stage.value).toBe('result')
    expect(card.confirming.value).toBe(false)
  })

  it('backToPayer conserva los datos y descarta el código', async () => {
    const card = await filled()
    await card.requestOtp(charge)
    card.setOtp('99999999')
    await card.confirmOtp()
    expect(card.result.value?.status).toBe('denied')

    card.backToPayer()
    expect(card.stage.value).toBe('payer')
    expect(card.result.value).toBeNull()
    expect(card.challenge.value).toBeNull()
    expect(card.otp.value).toBe('')
    expect(card.documentNumber.value).toBe('12345678')
    expect(card.methodId.value).toBe(3)
  })

  it('una respuesta vieja no pisa el estado después de volver', async () => {
    const card = await filled()
    const pending = card.requestOtp(charge)
    card.backToPayer()
    expect(await pending).toBe(false)
    expect(card.stage.value).toBe('payer')
    expect(card.challenge.value).toBeNull()
    expect(card.requesting.value).toBe(false)
  })

  it('reset deja el pago como nuevo y conserva los emisores', async () => {
    const card = await filled()
    card.reset()
    expect(card.documentNumber.value).toBe('')
    expect(card.methodId.value).toBeNull()
    expect(card.methods.value).toHaveLength(5)
  })
})

describe('useIpgPayment · lo que falta para pagar', () => {
  it('nombra los datos pendientes en el orden del formulario', async () => {
    const card = useIpgPayment()
    await card.loadMethods()
    expect(card.missingFields.value).toEqual(['documentNumber', 'methodId'])
    card.setDocumentNumber('12345678')
    expect(card.missingFields.value).toEqual(['methodId'])
    card.selectMethod(1)
    expect(card.missingFields.value).toEqual([])
    expect(card.payerValid.value).toBe(true)
  })

  it('el aviso une los pendientes con «y»', () => {
    expect(ipgMissingHint(['methodId'])).toBe('Falta: el método de pago.')
    expect(ipgMissingHint(['documentNumber', 'methodId'])).toBe('Falta: tu número de documento y el método de pago.')
  })
})

describe('ipgMethodLogo', () => {
  it('las tarjetas llevan el logo de su marca; las cuentas, ninguno', () => {
    expect(ipgMethodLogo(3)).toBeTruthy()
    expect(ipgMethodLogo(4)).toBeTruthy()
    expect(ipgMethodLogo(3)).not.toBe(ipgMethodLogo(4))
    expect(ipgMethodLogo(21)).toBe(ipgMethodLogo(4))
    expect(ipgMethodLogo(1)).toBeUndefined()
    expect(ipgMethodLogo(2)).toBeUndefined()
  })
})

describe('Botón de Pago IPG · casos de error (mock)', () => {
  async function filledFor(documentNumber: string) {
    const ipg = useIpgPayment()
    await ipg.loadMethods()
    ipg.setDocumentNumber(documentNumber)
    ipg.selectMethod(3)
    return ipg
  }

  async function atOtp(code: string) {
    const ipg = await filledFor('12345678')
    expect(await ipg.requestOtp(charge)).toBe(true)
    ipg.setOtp(code)
    return ipg
  }

  it.each([
    ['10000000', 'payer_rejected'],
    ['11111111', 'bank_unavailable'],
    ['12222222', 'method_unavailable'],
    ['13333333', 'payment_in_progress'],
  ] as const)('el documento %s falla al pedir el código con su mensaje', async (doc, kind) => {
    const ipg = await filledFor(doc)
    expect(await ipg.requestOtp(charge)).toBe(false)
    expect(ipg.stage.value).toBe('payer')
    expect(ipg.requestError.value).toBe(IPG_ERROR_MESSAGES[kind])
    expect(ipg.requesting.value).toBe(false)
  })

  it('código incorrecto: se queda en el código, lo borra y cuenta los intentos; al tercero, bloqueado', async () => {
    const ipg = await atOtp('00000000')
    await ipg.confirmOtp()
    expect(ipg.stage.value).toBe('otp')
    expect(ipg.otp.value).toBe('')
    expect(ipg.otpError.value).toBe(ipgOtpInvalidMessage(2))

    ipg.setOtp('00000000')
    await ipg.confirmOtp()
    expect(ipg.otpError.value).toBe('El código no es correcto. Te queda 1 intento.')

    ipg.setOtp('00000000')
    await ipg.confirmOtp()
    expect(ipg.stage.value).toBe('payer')
    expect(ipg.requestError.value).toBe(IPG_ERROR_MESSAGES.otp_blocked)
    expect(ipg.documentNumber.value).toBe('12345678')
  })

  it('código vencido: vuelve a los datos con el aviso y los datos intactos', async () => {
    const ipg = await atOtp('11111111')
    expect(await ipg.confirmOtp()).toBeNull()
    expect(ipg.stage.value).toBe('payer')
    expect(ipg.requestError.value).toBe(IPG_ERROR_MESSAGES.otp_expired)
    expect(ipg.methodId.value).toBe(3)
    expect(ipg.confirming.value).toBe(false)
  })

  it('sin respuesta del banco al confirmar: resultado «por confirmar» con el monto', async () => {
    const ipg = await atOtp('22222222')
    expect(await ipg.confirmOtp()).toBeNull()
    expect(ipg.stage.value).toBe('result')
    expect(ipg.result.value).toMatchObject({ status: 'unknown', amount: 'Bs. 500,00', operationNumber: '' })
    expect(ipg.challenge.value).toBeNull()
  })

  it('pedir el código de nuevo limpia el aviso anterior', async () => {
    const ipg = await atOtp('11111111')
    await ipg.confirmOtp()
    expect(await ipg.requestOtp(charge)).toBe(true)
    expect(ipg.requestError.value).toBe('')
    expect(ipg.stage.value).toBe('otp')
  })
})
