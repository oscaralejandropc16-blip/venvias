/**
 * Cliente HTTP único de la aplicación. Es la **única** capa que conoce
 * `axios` y la URL base del backend. Los services consumen este cliente —
 * nunca llaman a `axios` directamente.
 *
 * Importado de toll-management-ui. El sitio público no tiene sesión: se
 * omiten el auth store y la redirección a login de la referencia. Cuando
 * exista «Mi cuenta», el manejo de 401/403 se agrega aquí.
 */

import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useToastStore } from '@/app/stores/toast.store'

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '')

const GLOBAL_LOG_ENABLED = String(import.meta.env.VITE_API_LOG ?? '').toLowerCase() === 'true'

const CONNECTION_ERROR_MESSAGE = 'No pudimos conectarnos. Revisa tu conexión y vuelve a intentar.'

// La placa no es secreta, pero los datos de pago sí: nunca llegan a la consola.
const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'csrf_token',
  'card_number',
  'cvv',
  'document_id',
  'document_number',
  'otp',
])

function maskSensitive(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map(maskSensitive)
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(k)) {
      out[k] = '***'
    } else if (v && typeof v === 'object') {
      out[k] = maskSensitive(v)
    } else {
      out[k] = v
    }
  }
  return out
}

function shouldLog(perRequest: boolean | undefined): boolean {
  if (perRequest === false) return false
  if (perRequest === true) return true
  return GLOBAL_LOG_ENABLED
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface HttpRequestOptions {
  method?: HttpMethod
  body?: unknown
  query?: Record<string, unknown>
  headers?: Record<string, string>
  signal?: AbortSignal
  /** Códigos que el llamador maneja: no se muestran como toast. */
  silentStatuses?: number[]
  log?: boolean
  responseType?: 'json' | 'blob'
}

export class HttpError extends Error {
  readonly status: number
  readonly payload: unknown

  constructor(status: number, message: string, payload: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.payload = payload
  }
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || '/',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  // `Content-Type` lo decide axios según el body (JSON, FormData, Blob).
  headers: {
    Accept: 'application/json',
  },
  paramsSerializer: {
    serialize: (params) => {
      const usp = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue
        if (Array.isArray(value)) {
          for (const item of value) {
            if (item === undefined || item === null) continue
            usp.append(key, String(item))
          }
        } else {
          usp.append(key, String(value))
        }
      }
      return usp.toString()
    },
  },
})

function extractReason(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return ''
  if (!('reason' in payload)) return ''
  const reason = (payload as { reason: unknown }).reason
  if (typeof reason !== 'string') return ''
  return reason.trim()
}

function presentErrorMessage(message: string): string {
  return message.trim().toLowerCase() === 'network error' ? CONNECTION_ERROR_MESSAGE : message
}

export function buildHttpError(error: unknown): HttpError {
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0
    const payload = error.response?.data ?? null
    const reason = extractReason(payload)
    const message = presentErrorMessage(reason || error.message || `Error HTTP ${status}`)
    return new HttpError(status, message, payload)
  }
  const message = presentErrorMessage(error instanceof Error ? error.message : 'Error desconocido')
  return new HttpError(0, message, null)
}

function notifyHttpError(error: HttpError, silentStatuses: number[]): void {
  if (silentStatuses.includes(error.status)) return
  try {
    useToastStore().error(error.message)
  } catch {
    if (typeof window !== 'undefined') window.alert(error.message)
  }
}

export async function httpRequestFull<T>(
  path: string,
  options: HttpRequestOptions = {},
): Promise<AxiosResponse<T>> {
  const {
    method = 'GET',
    body,
    query,
    headers,
    signal,
    silentStatuses = [],
    log,
    responseType = 'json',
  } = options

  const config: AxiosRequestConfig = {
    url: path,
    method,
    headers,
    params: query,
    signal: signal as AxiosRequestConfig['signal'],
    responseType,
  }

  if (body !== undefined && body !== null) {
    config.data = body
  }

  const logEnabled = shouldLog(log)
  const startedAt = logEnabled ? performance.now() : 0

  if (logEnabled) {
    console.groupCollapsed(`%c[API] → ${method} ${path}`, 'color:#5d6a80')
    if (query) console.log('query:', query)
    if (body !== undefined && body !== null) console.log('body:', maskSensitive(body))
    console.groupEnd()
  }

  try {
    const response = await axiosInstance.request<T>(config)
    if (logEnabled) {
      const ms = Math.round(performance.now() - startedAt)
      console.groupCollapsed(`%c[API] ← ${method} ${path} ${response.status} (${ms}ms)`, 'color:#0057a3')
      console.log('response:', maskSensitive(response.data))
      console.groupEnd()
    }
    return response
  } catch (error) {
    const httpError = buildHttpError(error)
    if (logEnabled) {
      const ms = Math.round(performance.now() - startedAt)
      console.groupCollapsed(`%c[API] ✗ ${method} ${path} ${httpError.status} (${ms}ms)`, 'color:#cf142b')
      console.log('message:', httpError.message)
      if (httpError.payload) console.log('payload:', httpError.payload)
      console.groupEnd()
    }
    notifyHttpError(httpError, silentStatuses)
    throw httpError
  }
}

export async function httpRequest<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
  return (await httpRequestFull<T>(path, options)).data
}

export const httpClient = {
  get: <T>(path: string, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
    httpRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
    httpRequest<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
    httpRequest<T>(path, { ...options, method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
    httpRequest<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
    httpRequest<T>(path, { ...options, method: 'DELETE' }),
}

/** `true` cuando hay backend configurado; si no, los services sirven sus mocks. */
export const hasApiBackend = API_BASE_URL.length > 0
