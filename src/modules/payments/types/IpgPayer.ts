export type PersonType = 'natural' | 'juridica'
export type DocumentType = 'V' | 'E' | 'P' | 'J' | 'G' | 'C'

/** Datos del pagador que pide el Botón de Pago IPG del Banco de Venezuela. */
export interface IpgPayer {
  personType: PersonType
  documentType: DocumentType
  documentNumber: string
  /** Id del método de pago IPG elegido (cuenta o tarjeta). */
  methodId: number
}

/** Campos del pagador que se validan al salir de ellos. */
export type IpgPayerField = 'documentNumber' | 'methodId'
