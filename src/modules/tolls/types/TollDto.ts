/** Peaje habilitado tal como lo entrega el backend (o su mock). */
export interface TollDto {
  id: string
  name: string
  state: string
  road: string | null
  latitude: number
  longitude: number
}
