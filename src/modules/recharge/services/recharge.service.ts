/**
 * Service de recargas. Es la única capa que conoce los paths de la API y la
 * forma cruda (DTO). Mientras no haya backend sirve el mock adyacente; al
 * conectarlo solo cambia este archivo.
 */

import { hasApiBackend, httpClient } from '@/core/api/httpClient'
import { creditMockWallet } from '@/modules/balance/services/balance.service'
import { mapPaymentMethodDtoToView } from '../mappers/paymentMethod.mapper'
import { mapRechargeAmountDtoToView } from '../mappers/rechargeAmount.mapper'
import { mapRechargeLimitsDtoToView } from '../mappers/rechargeLimits.mapper'
import { mapRechargeReceiptDtoToView } from '../mappers/rechargeReceipt.mapper'
import type { PaymentMethodOption } from '../types/PaymentMethodOption'
import type { PaymentMethodOptionDto } from '../types/PaymentMethodOptionDto'
import type { RechargeAmountOption } from '../types/RechargeAmountOption'
import type { RechargeAmountOptionDto } from '../types/RechargeAmountOptionDto'
import type { RechargeLimits } from '../types/RechargeLimits'
import type { RechargeLimitsDto } from '../types/RechargeLimitsDto'
import type { RechargeReceipt, RechargeRequest } from '../types/RechargeReceipt'
import type { RechargeReceiptDto } from '../types/RechargeReceiptDto'
import rechargeMock from './recharge.mock.json'

const PATHS = {
  amountOptions: '/public/recharges/amount-options/',
  paymentMethods: '/public/recharges/payment-methods/',
  limits: '/public/recharges/limits/',
  recharges: '/public/recharges/',
}

interface ListDto<T> {
  items: T[]
}

export async function getRechargeAmountOptions(): Promise<RechargeAmountOption[]> {
  const response = hasApiBackend
    ? await httpClient.get<ListDto<RechargeAmountOptionDto>>(PATHS.amountOptions)
    : (rechargeMock.amountOptions as ListDto<RechargeAmountOptionDto>)
  return response.items.map(mapRechargeAmountDtoToView)
}

export async function getPaymentMethods(): Promise<PaymentMethodOption[]> {
  const response = hasApiBackend
    ? await httpClient.get<ListDto<PaymentMethodOptionDto>>(PATHS.paymentMethods)
    : rechargeMock.paymentMethods
  return response.items.map(mapPaymentMethodDtoToView)
}

export async function getRechargeLimits(): Promise<RechargeLimits> {
  const dto = hasApiBackend ? await httpClient.get<RechargeLimitsDto>(PATHS.limits) : rechargeMock.limits
  return mapRechargeLimitsDtoToView(dto)
}

// Mock: la primera acreditación de esta referencia falla, para probar el reintento sin cobrar de nuevo.
const settleFailedOnce = new Set<string>()

function mockRecharge(request: RechargeRequest): RechargeReceiptDto {
  const failRef = rechargeMock.settleFailReferenceOnce
  if (request.paymentReference === failRef && !settleFailedOnce.has(failRef)) {
    settleFailedOnce.add(failRef)
    throw new Error('Mock: la acreditación falló una vez.')
  }
  const { fee, currency } = rechargeMock.limits
  const wallet = creditMockWallet(request.plate, request.amount)
  return {
    reference: request.paymentReference || `VV-${Date.now().toString(36).toUpperCase()}`,
    plate: request.plate,
    amount: request.amount,
    fee,
    total: request.amount + fee,
    balance_after: wallet.balance,
    currency,
    payment_method: request.paymentMethod,
    security_code: String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0'),
    paid_at: new Date().toISOString(),
  }
}

export async function createRecharge(request: RechargeRequest): Promise<RechargeReceipt> {
  const dto = hasApiBackend
    ? await httpClient.post<RechargeReceiptDto>(
        PATHS.recharges,
        {
          plate: request.plate,
          amount: request.amount,
          payment_method: request.paymentMethod,
          ...(request.paymentReference ? { payment_reference: request.paymentReference } : {}),
        },
        // Un pago rechazado se explica junto al botón de pagar, no en un toast.
        { silentStatuses: [400, 402, 409, 422] },
      )
    : mockRecharge(request)
  return mapRechargeReceiptDtoToView(dto)
}
