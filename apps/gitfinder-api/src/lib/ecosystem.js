import { readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

/**
 * Ecosystem registry loader.
 *
 * Attempts to load ecosystem.json from master-weaver-master in these locations:
 *   1. ECOSYSTEM_JSON env var (explicit path)
 *   2. ../../ecosystem.json (relative to api — works if gitfinder is nested)
 *   3. ../../../master-weaver-master/ecosystem.json (sibling checkout)
 *   4. Falls back to a hard-coded subset of the Master Weaver ecosystem
 *
 * @returns {{ repos: object[], dependencies: object[] }}
 */
export function loadEcosystem() {
  const candidates = [
    process.env.ECOSYSTEM_JSON,
    resolve(process.cwd(), '../../ecosystem.json'),
    resolve(process.cwd(), '../../../master-weaver-master/ecosystem.json'),
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      try {
        const raw = JSON.parse(readFileSync(candidate, 'utf8'))
        return parseEcosystemJson(raw, candidate)
      } catch {
        // continue to next candidate
      }
    }
  }

  // Fallback: static ecosystem definition matching the sample data
  return getStaticEcosystem()
}

/**
 * Parse the master-weaver-master ecosystem.json into repo + dependency lists.
 */
function parseEcosystemJson(raw, filePath) {
  const basePath = resolve(filePath, '..', raw.basePath || '..')
  const repos = []
  const dependencies = []

  const ecosystems = raw.ecosystems || {}
  for (const [ecoName, eco] of Object.entries(ecosystems)) {
    const ecoRepos = eco.repos || []
    for (const r of ecoRepos) {
      const diskPath = r.path ? resolve(basePath, r.path) : null
      repos.push({
        id: r.name || r.repo || ecoName,
        name: r.name || r.repo || ecoName,
        ecosystem: ecoName,
        repoUrl: r.url || '',
        diskPath,
        defaultBranch: r.branch || 'dev',
        mergeReadinessScore: 50,
        branches: [],
      })
    }

    // Ecosystem-level deps
    const deps = eco.dependsOn || []
    for (const dep of deps) {
      const fromId = ecoRepos[0]?.name || ecoName
      dependencies.push({ from: fromId, to: dep, type: 'package' })
    }
  }

  // If the ecosystems key is empty, try the flat repos array
  if (repos.length === 0 && Array.isArray(raw.repos)) {
    for (const r of raw.repos) {
      repos.push({
        id: r.name,
        name: r.name,
        ecosystem: r.ecosystem || 'unknown',
        repoUrl: r.url || '',
        diskPath: r.path ? resolve(basePath, r.path) : null,
        defaultBranch: r.branch || 'dev',
        mergeReadinessScore: 50,
        branches: [],
      })
    }
  }

  return { repos, dependencies }
}

/**
 * Static ecosystem definition matching the hub's sample data.
 * Used when no ecosystem.json is found on disk.
 */
function getStaticEcosystem() {
  const repos = [
    { id: 'finderauth', name: 'finderauth', ecosystem: 'finderauth', defaultBranch: 'dev', mergeReadinessScore: 96 },
    { id: 'db-manager', name: 'db-manager', ecosystem: 'db-manager', defaultBranch: 'dev', mergeReadinessScore: 88 },
    { id: 'finder-starter', name: 'finder-starter', ecosystem: 'finder', defaultBranch: 'dev', mergeReadinessScore: 92 },
    { id: 'admin-starter', name: 'admin-starter', ecosystem: 'admin', defaultBranch: 'dev', mergeReadinessScore: 95 },
    { id: 'etd-starter', name: 'etd-starter', ecosystem: 'etd', defaultBranch: 'dev', mergeReadinessScore: 84 },
    { id: 'ODYN-starter', name: 'ODYN-starter', ecosystem: 'odyn', defaultBranch: 'dev', mergeReadinessScore: 87 },
    { id: 'design-starter', name: 'design-starter', ecosystem: 'design', defaultBranch: 'dev', mergeReadinessScore: 78 },
    { id: 'crowds', name: 'crowds', ecosystem: 'crowds', defaultBranch: 'dev', mergeReadinessScore: 90 },
    { id: 'opensoftware-starter', name: 'opensoftware-starter', ecosystem: 'opensoftware', defaultBranch: 'dev', mergeReadinessScore: 82 },
    { id: 'devtools-manager', name: 'devtools-manager', ecosystem: 'devtools', defaultBranch: 'dev', mergeReadinessScore: 71 },
    { id: 'gitfinder-starter', name: 'gitfinder-starter', ecosystem: 'gitfinder', defaultBranch: 'dev', mergeReadinessScore: 45 },
    { id: 'feedback-starter', name: 'feedback-starter', ecosystem: 'feedback', defaultBranch: 'dev', mergeReadinessScore: 65 },
  ].map(r => ({ ...r, repoUrl: '', diskPath: null, branches: [] }))

  const dependencies = [
    { from: 'finder-starter', to: 'finderauth', type: 'package' },
    { from: 'admin-starter', to: 'finderauth', type: 'package' },
    { from: 'etd-starter', to: 'finderauth', type: 'package' },
    { from: 'finder-starter', to: 'db-manager', type: 'package' },
    { from: 'admin-starter', to: 'db-manager', type: 'package' },
    { from: 'crowds', to: 'db-manager', type: 'package' },
    { from: 'ODYN-starter', to: 'finder-starter', type: 'template' },
    { from: 'design-starter', to: 'finder-starter', type: 'template' },
    { from: 'devtools-manager', to: 'admin-starter', type: 'config' },
    { from: 'opensoftware-starter', to: 'etd-starter', type: 'template' },
    { from: 'devtools-manager', to: 'ODYN-starter', type: 'config' },
    { from: 'gitfinder-starter', to: 'design-starter', type: 'template' },
    { from: 'feedback-starter', to: 'crowds', type: 'template' },
  ]

  return { repos, dependencies }
}
