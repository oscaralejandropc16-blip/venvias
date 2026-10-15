/** Punto de un peaje ya proyectado a píxeles del mapa. */
export interface ProjectedToll {
  id: string
  x: number
  y: number
}

/**
 * Agrupa peajes cuyos pines se taparían entre sí (a menos de `radius` px).
 * Codicioso y estable: cada grupo arranca en el primer peaje libre y suma los
 * cercanos a él. Con una decena de peajes no hace falta nada más fino.
 */
export function clusterByDistance(points: ProjectedToll[], radius: number): string[][] {
  const taken = new Set<string>()
  const groups: string[][] = []
  for (const seed of points) {
    if (taken.has(seed.id)) continue
    const group = [seed.id]
    taken.add(seed.id)
    for (const other of points) {
      if (taken.has(other.id)) continue
      if (Math.hypot(other.x - seed.x, other.y - seed.y) < radius) {
        group.push(other.id)
        taken.add(other.id)
      }
    }
    groups.push(group)
  }
  return groups
}
