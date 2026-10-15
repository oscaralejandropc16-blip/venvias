import type { Toll, TollStateGroup } from '../types/Toll'

const byName = new Intl.Collator('es', { sensitivity: 'base' })

/** Agrupa los peajes por estado; estados y peajes en orden alfabético. */
export function groupTollsByState(tolls: Toll[]): TollStateGroup[] {
  const groups = new Map<string, Toll[]>()
  for (const toll of tolls) {
    const list = groups.get(toll.state)
    if (list) list.push(toll)
    else groups.set(toll.state, [toll])
  }
  return [...groups.entries()]
    .sort(([a], [b]) => byName.compare(a, b))
    .map(([state, list]) => ({ state, tolls: [...list].sort((a, b) => byName.compare(a.name, b.name)) }))
}
