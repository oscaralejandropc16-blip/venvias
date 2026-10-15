import { describe, expect, it } from 'vitest'
import { AxiosError, AxiosHeaders } from 'axios'
import { buildHttpError } from '@/core/api/httpClient'

function axiosErrorWith(status: number, data: unknown, message = 'Request failed'): AxiosError {
  const config = { headers: new AxiosHeaders() }
  return new AxiosError(message, 'ERR', config, null, { status, statusText: '', headers: {}, config, data })
}

describe('buildHttpError', () => {
  it('usa el `reason` del backend como mensaje', () => {
    const error = buildHttpError(axiosErrorWith(422, { reason: 'Placa no registrada' }))
    expect(error.status).toBe(422)
    expect(error.message).toBe('Placa no registrada')
  })

  it('traduce el error de red a un mensaje para el conductor', () => {
    const error = buildHttpError(new AxiosError('Network Error'))
    expect(error.status).toBe(0)
    expect(error.message).toMatch(/conectarnos/)
  })
})
