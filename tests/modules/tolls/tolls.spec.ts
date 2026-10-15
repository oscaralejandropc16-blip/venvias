import { describe, expect, it } from 'vitest'
import { mapTollDtoToView } from '@/modules/tolls/mappers/toll.mapper'
import { useTollsList } from '@/modules/tolls/composables/useTollsList'
import { groupTollsByState } from '@/modules/tolls/utils/groupTolls'
import { tollsCountLabel } from '@/modules/tolls/constants/tolls'
import type { Toll } from '@/modules/tolls/types/Toll'

const toll = (id: string, name: string, state: string): Toll => ({ id, name, state, road: '', lat: 10, lng: -67 })

describe('tolls', () => {
  it('el mapper deja la vía vacía cuando no viene y pasa las coordenadas', () => {
    const view = mapTollDtoToView({ id: '1', name: 'Peaje', state: 'Aragua', road: null, latitude: 10.2, longitude: -67.6 })
    expect(view.road).toBe('')
    expect([view.lat, view.lng]).toEqual([10.2, -67.6])
  })

  it('sin backend, el mock sirve los 10 peajes de la spec', async () => {
    const { tolls, tollsError, fetchTolls } = useTollsList()
    await fetchTolls()
    expect(tollsError.value).toBe('')
    expect(tolls.value).toHaveLength(10)
    expect(tolls.value.every((t) => Number.isFinite(t.lat) && Number.isFinite(t.lng))).toBe(true)
  })

  it('agrupa por estado, estados y peajes en orden alfabético', () => {
    const groups = groupTollsByState([
      toll('a', 'Punta Iguana', 'Zulia'),
      toll('b', 'Guacara', 'Carabobo'),
      toll('c', 'Paraguachon', 'Zulia'),
      toll('d', 'La Entrada', 'Carabobo'),
    ])
    expect(groups.map((g) => g.state)).toEqual(['Carabobo', 'Zulia'])
    expect(groups[1].tolls.map((t) => t.name)).toEqual(['Paraguachon', 'Punta Iguana'])
  })

  it('el conteo usa singular cuando toca', () => {
    expect(tollsCountLabel(10, 5)).toBe('10 peajes en 5 estados')
    expect(tollsCountLabel(1, 1)).toBe('1 peaje en 1 estado')
  })
})

describe('clusterByDistance', () => {
  it('agrupa los pines que se taparían y deja sueltos los lejanos', async () => {
    const { clusterByDistance } = await import('@/modules/tolls/utils/clusterTolls')
    const groups = clusterByDistance(
      [
        { id: 'a', x: 0, y: 0 },
        { id: 'b', x: 10, y: 5 },
        { id: 'c', x: 200, y: 0 },
      ],
      40,
    )
    expect(groups).toEqual([['a', 'b'], ['c']])
  })
})
