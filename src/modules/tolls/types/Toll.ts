export interface Toll {
  id: string
  name: string
  state: string
  road: string
  lat: number
  lng: number
}

/** Peajes de un mismo estado, para la lista agrupada. */
export interface TollStateGroup {
  state: string
  tolls: Toll[]
}
