/**
 * Lo que cobra cada contexto (recarga, deuda…): el módulo de pagos no sabe
 * qué se paga, solo cuánto y con qué referencia.
 */
export interface IpgCharge {
  amount: number
  currency: string
  concept: { type: string; reference: string }
}
