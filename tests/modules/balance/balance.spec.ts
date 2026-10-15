import { describe, expect, it } from 'vitest'
import { mapWalletSummaryDtoToView } from '@/modules/balance/mappers/walletSummary.mapper'
import { creditMockWallet, inquireBalance } from '@/modules/balance/services/balance.service'
import { useBalanceInquiry } from '@/modules/balance/composables/useBalanceInquiry'
import { BALANCE_MESSAGES } from '@/modules/balance/constants/balance'
import { PLATE_ERROR_MESSAGES } from '@/modules/plates/constants/plateEntry.messages'

const dto = (status: string, balance = 12.5) => ({ plate: 'AB123CD', balance, currency: 'Bs.', status })

describe('balance · mapper', () => {
  it('formatea el saldo y da etiqueta y tono a cada estado', () => {
    expect(mapWalletSummaryDtoToView(dto('ACTIVE'))).toEqual({
      plate: 'AB123CD',
      balance: 12.5,
      balanceLabel: 'Bs. 12,50',
      status: 'ACTIVE',
      statusLabel: 'Activa',
      statusTone: 'ok',
    })
    expect(mapWalletSummaryDtoToView(dto('LOW_BALANCE')).statusTone).toBe('low')
    expect(mapWalletSummaryDtoToView(dto('ZERO_BALANCE', 0))).toMatchObject({ statusLabel: 'Sin saldo', statusTone: 'alert' })
    expect(mapWalletSummaryDtoToView(dto('BLOCKED')).statusTone).toBe('alert')
  })

  it('un estado desconocido queda «En revisión»', () => {
    expect(mapWalletSummaryDtoToView(dto('ALGO_NUEVO'))).toMatchObject({ status: 'REVIEW', statusLabel: 'En revisión', statusTone: 'low' })
  })
})

describe('balance · service (mock)', () => {
  it('devuelve el saldo de una placa conocida', async () => {
    const wallet = await inquireBalance('AC456EF', '123456')
    expect(wallet).toMatchObject({ balanceLabel: 'Bs. 7,20', status: 'LOW_BALANCE' })
  })

  it('una placa desconocida tiene saldo cero', async () => {
    const wallet = await inquireBalance('ZZ999ZZ', '123456')
    expect(wallet).toMatchObject({ plate: 'ZZ999ZZ', balance: 0, status: 'ZERO_BALANCE' })
  })

  it('una recarga simulada sube el saldo y reactiva la billetera', async () => {
    expect(creditMockWallet('AD789GH', 250)).toMatchObject({ balance: 250, status: 'ACTIVE' })
    expect((await inquireBalance('AD789GH', '000000')).balanceLabel).toBe('Bs. 250,00')
  })
})

describe('useBalanceInquiry', () => {
  it('con el código incompleto no consulta', async () => {
    const inquiry = useBalanceInquiry()
    inquiry.setPlate('AB123CD')
    inquiry.setCode('123')
    expect(await inquiry.submit()).toBe(false)
    expect(inquiry.codeError.value).toBe(BALANCE_MESSAGES.codeIncomplete)
    expect(inquiry.wallet.value).toBeNull()
  })

  it('con la placa incompleta avisa en la placa', async () => {
    const inquiry = useBalanceInquiry()
    inquiry.setPlate('AB1')
    inquiry.setCode('123456')
    expect(await inquiry.submit()).toBe(false)
    expect(inquiry.plateError.value).toBe(PLATE_ERROR_MESSAGES.short)
  })

  it('con placa y código consulta el saldo; reset vuelve al formulario', async () => {
    const inquiry = useBalanceInquiry()
    inquiry.setPlate('ab-123-cd')
    inquiry.setCode('654321')
    expect(inquiry.codeComplete.value).toBe(true)
    expect(await inquiry.submit()).toBe(true)
    expect(inquiry.loading.value).toBe(false)
    expect(inquiry.wallet.value).toMatchObject({ plate: 'AB123CD', balanceLabel: 'Bs. 12,50' })

    inquiry.reset()
    expect(inquiry.wallet.value).toBeNull()
    expect(inquiry.plate.value).toBe('')
    expect(inquiry.code.value).toBe('')
  })
})
