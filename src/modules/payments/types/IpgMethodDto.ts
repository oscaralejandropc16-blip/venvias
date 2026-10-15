/** Método de pago del Botón de Pago IPG tal como lo entrega el backend (o su mock). */
export interface IpgMethodDto {
  id: number
  name: string
  shortName: string
  paymentDetailType: number
}
