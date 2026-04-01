import { topologicalSort } from './topo-sort.js'

/**
 * Build a MergeDAG from repositories, dependencies, and conflict zones.
 *
 * Groups repos into waves — each wave contains repos whose dependencies
 * were all resolved in earlier waves.
 *
 * @param {object[]} repos
 * @param {{ from: string, to: string, type?: string }[]} dependencies
 * @param {object[]} conflictZones
 * @returns {{ waves: object[], totalRepos: number, totalBranches: number, conflictZones: object[], estimatedMergeTime: number }}
 */
export function buildMergeDAG(repos, dependencies, conflictZones = []) {
  const repoIds = repos.map(r => r.id)
  const edges = dependencies.map(d => ({ from: d.from, to: d.to }))
  const sortedWaves = topologicalSort(repoIds, edges)

  const repoMap = new Map(repos.map(r => [r.id, r]))

  const waves = sortedWaves.map((waveRepoIds, index) => ({
    number: index + 1,
    repos: waveRepoIds.map(id => repoMap.get(id)).filter(Boolean),
    dependsOnWave: index > 0 ? index : null,
    status: 'pending',
  }))

  const totalBranches = repos.reduce(
    (sum, r) => sum + (r.branches?.length ?? 0),
    0,
  )

  // Estimate: 2 min per repo with conflicts, 30 sec per clean merge
  const conflictRepoIds = new Set(conflictZones.map(cz => cz.repoId))
  const estimatedMergeTime = repos.reduce((sum, r) => {
    return sum + (conflictRepoIds.has(r.id) ? 2 : 0.5)
  }, 0)

  return {
    waves,
    totalRepos: repos.length,
    totalBranches,
    conflictZones,
    estimatedMergeTime: Math.ceil(estimatedMergeTime),
  }
}

// ---- ReactFlow graph builder ------------------------------------------------

const WAVE_SPACING_X = 350
const REPO_SPACING_Y = 160
const BRANCH_OFFSET_X = 200
const BRANCH_SPACING_Y = 60

/**
 * Convert a MergeDAG into ReactFlow-compatible nodes and edges.
 *
 * @param {{ waves: object[], conflictZones: object[] }} dag
 * @returns {{ nodes: object[], edges: object[] }}
 */
export function buildReactFlowGraph(dag) {
  const nodes = []
  const edges = []

  for (const wave of dag.waves) {
    const waveX = (wave.number - 1) * WAVE_SPACING_X

    // Wave group node
    nodes.push({
      id: `wave-${wave.number}`,
      type: 'wave',
      position: { x: waveX - 20, y: -60 },
      data: {
        label: `Wave ${wave.number}`,
        status: wave.status,
        repoCount: wave.repos.length,
      },
    })

    // Repo nodes in this wave
    wave.repos.forEach((repo, repoIdx) => {
      const repoY = repoIdx * REPO_SPACING_Y

      nodes.push({
        id: `repo-${repo.id}`,
        type: 'repo',
        position: { x: waveX, y: repoY },
        data: {
          name: repo.name,
          ecosystem: repo.ecosystem,
          mergeReadiness: repo.mergeReadinessScore ?? 0,
          branchCount: repo.branches?.length ?? 0,
          defaultBranch: repo.defaultBranch,
        },
      })

      // Branch nodes for this repo
      if (repo.branches) {
        repo.branches.forEach((branch, branchIdx) => {
          nodes.push({
            id: `branch-${repo.id}-${branch.name}`,
            type: 'branch',
            position: {
              x: waveX + BRANCH_OFFSET_X,
              y: repoY + branchIdx * BRANCH_SPACING_Y,
            },
            data: {
              name: branch.name,
              aheadCount: branch.aheadCount,
              behindCount: branch.behindCount,
              owner: branch.owner,
              staleness: branch.stalenessScore,
            },
          })

          edges.push({
            id: `edge-repo-branch-${repo.id}-${branch.name}`,
            source: `repo-${repo.id}`,
            target: `branch-${repo.id}-${branch.name}`,
            type: 'branch',
          })
        })
      }
    })

    // Wave dependency edges
    if (wave.dependsOnWave !== null) {
      edges.push({
        id: `edge-wave-${wave.dependsOnWave}-${wave.number}`,
        source: `wave-${wave.dependsOnWave}`,
        target: `wave-${wave.number}`,
        type: 'dependency',
        animated: true,
        style: { stroke: '#3b82f6', strokeDasharray: '5 5' },
      })
    }
  }

  // Conflict zone nodes
  for (const cz of dag.conflictZones) {
    nodes.push({
      id: `conflict-${cz.id}`,
      type: 'conflict',
      position: { x: 0, y: 0 },
      data: {
        filePath: cz.filePath ?? cz.file,
        branches: cz.branches,
        severity: cz.severity,
        repoId: cz.repoId,
      },
    })

    edges.push({
      id: `edge-conflict-${cz.id}`,
      source: `repo-${cz.repoId}`,
      target: `conflict-${cz.id}`,
      type: 'conflict',
      style: { stroke: '#ef4444' },
    })
  }

  return { nodes, edges }
}
