/**
 * Topological sort using Kahn's algorithm.
 *
 * Returns an array of "waves" where each wave contains repo IDs that
 * can be merged in parallel (all their dependencies are in earlier waves).
 *
 * If a cycle is detected, the remaining repos are pushed into a final
 * wave so callers can surface the issue rather than silently dropping nodes.
 *
 * @param {string[]} repoIds
 * @param {{ from: string, to: string }[]} edges  - edge.to must be merged first, then edge.from
 * @returns {string[][]} - array of waves (each wave is an array of repo IDs)
 */
export function topologicalSort(repoIds, edges) {
  const inDegree = new Map()
  const adjacency = new Map()

  for (const id of repoIds) {
    inDegree.set(id, 0)
    adjacency.set(id, [])
  }

  for (const edge of edges) {
    // edge.to must be merged first, then edge.from can proceed
    const neighbors = adjacency.get(edge.to)
    if (neighbors) neighbors.push(edge.from)
    inDegree.set(edge.from, (inDegree.get(edge.from) ?? 0) + 1)
  }

  const waves = []
  const remaining = new Set(repoIds)

  while (remaining.size > 0) {
    const wave = [...remaining].filter(id => (inDegree.get(id) ?? 0) === 0)

    if (wave.length === 0) {
      // Cycle detected — add remaining as final wave with warning
      waves.push([...remaining])
      break
    }

    waves.push(wave)

    for (const id of wave) {
      remaining.delete(id)
      for (const dependent of adjacency.get(id) ?? []) {
        inDegree.set(dependent, (inDegree.get(dependent) ?? 0) - 1)
      }
    }
  }

  return waves
}
