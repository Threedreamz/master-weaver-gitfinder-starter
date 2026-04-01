import { Router } from 'express'
import { getRepos, getDependencies, getConflicts } from '../lib/state.js'
import { buildMergeDAG, buildReactFlowGraph } from '../lib/dag.js'

const router = Router()

/**
 * GET /api/gitfinder/graph
 *
 * Returns the ReactFlow-compatible DAG graph with nodes and edges.
 * The hub's useApi hook extracts the single `graph` key.
 *
 * If no repos are loaded yet, returns a static fallback graph matching
 * the hub's inline fallback so the DAG page always renders.
 */
router.get('/graph', (req, res) => {
  const repos = getRepos()
  const dependencies = getDependencies()
  const conflicts = getConflicts()

  if (repos.length === 0) {
    // Return static fallback matching the hub's graph route fallback
    return res.json({ live: false, graph: getStaticGraph() })
  }

  // Build the merge DAG from current state
  const dag = buildMergeDAG(repos, dependencies, conflicts)

  // Convert to ReactFlow nodes + edges
  const graph = buildReactFlowGraph(dag)

  res.json({ live: true, graph })
})

/**
 * Static fallback graph matching the hub's inline fallback data.
 */
function getStaticGraph() {
  return {
    nodes: [
      { id: 'finderauth', label: 'FinderAuth', group: 'foundation', x: 100, y: 200 },
      { id: 'db-manager', label: 'DB Manager', group: 'foundation', x: 100, y: 350 },
      { id: 'finder-starter', label: 'Finder Starter', group: 'core', x: 350, y: 100 },
      { id: 'admin-starter', label: 'Admin Starter', group: 'core', x: 350, y: 250 },
      { id: 'etd-starter', label: 'ETD Starter', group: 'core', x: 350, y: 400 },
      { id: 'ODYN-starter', label: 'ODYN Starter', group: 'extended', x: 600, y: 100 },
      { id: 'design-starter', label: 'Design Starter', group: 'extended', x: 600, y: 225 },
      { id: 'crowds', label: 'Crowds', group: 'extended', x: 600, y: 350 },
      { id: 'opensoftware-starter', label: 'OpenSoftware', group: 'extended', x: 600, y: 475 },
      { id: 'devtools-manager', label: 'DevTools Manager', group: 'meta', x: 850, y: 150 },
      { id: 'gitfinder-starter', label: 'GitFinder Starter', group: 'meta', x: 850, y: 300 },
      { id: 'feedback-starter', label: 'Feedback Starter', group: 'meta', x: 850, y: 450 },
    ],
    edges: [
      { from: 'finderauth', to: 'finder-starter' },
      { from: 'finderauth', to: 'admin-starter' },
      { from: 'finderauth', to: 'etd-starter' },
      { from: 'db-manager', to: 'finder-starter' },
      { from: 'db-manager', to: 'admin-starter' },
      { from: 'db-manager', to: 'crowds' },
      { from: 'finder-starter', to: 'ODYN-starter' },
      { from: 'finder-starter', to: 'design-starter' },
      { from: 'admin-starter', to: 'devtools-manager' },
      { from: 'etd-starter', to: 'opensoftware-starter' },
      { from: 'ODYN-starter', to: 'devtools-manager' },
      { from: 'design-starter', to: 'gitfinder-starter' },
      { from: 'crowds', to: 'feedback-starter' },
    ],
  }
}

export default router
