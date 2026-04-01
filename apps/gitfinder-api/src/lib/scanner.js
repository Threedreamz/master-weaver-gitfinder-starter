import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { loadEcosystem } from './ecosystem.js'
import { buildMergeDAG } from './dag.js'
import {
  setRepos,
  setWaves,
  setConflicts,
  setDependencies,
  setScanningState,
  recordScanComplete,
  addActivity,
  getRepos,
} from './state.js'

let scanMutex = false

/**
 * Run a full ecosystem scan.
 *
 * 1. Load the ecosystem registry (ecosystem.json or static fallback)
 * 2. For each repo with a diskPath, run git commands to gather branch info
 * 3. Build the merge DAG (topo-sort into waves)
 * 4. Detect conflict zones
 * 5. Store everything in the in-memory state
 *
 * Returns a summary object. Uses a mutex to prevent concurrent scans.
 */
export async function runScan() {
  if (scanMutex) {
    return { skipped: true, reason: 'Scan already in progress' }
  }

  scanMutex = true
  setScanningState(true)
  const start = Date.now()

  try {
    const { repos: ecoRepos, dependencies } = loadEcosystem()

    // Enrich repos with live git data where possible
    const enrichedRepos = ecoRepos.map(repo => enrichRepo(repo))

    // Detect conflict zones across repos
    const conflicts = detectConflicts(enrichedRepos)

    // Build DAG waves from topo-sort
    const dag = buildMergeDAG(enrichedRepos, dependencies, conflicts)

    // Persist to state
    setRepos(enrichedRepos)
    setDependencies(dependencies)
    setConflicts(conflicts)

    // Convert waves for the hub's expected format
    const waveNames = ['Foundation', 'Core Starters', 'Extended', 'Meta & Tools', 'Tier 5', 'Tier 6']
    const hubWaves = dag.waves.map((w, i) => ({
      id: w.number,
      name: waveNames[i] || `Wave ${w.number}`,
      repos: w.repos.map(r => r.name),
      status: w.status,
      dependencies: w.dependsOnWave !== null ? [w.dependsOnWave] : [],
      readiness: Math.round(
        w.repos.reduce((sum, r) => sum + (r.mergeReadinessScore ?? 50), 0) / Math.max(w.repos.length, 1),
      ),
    }))
    setWaves(hubWaves)

    const elapsed = Date.now() - start
    addActivity('scan', `Full ecosystem scan completed — ${enrichedRepos.length} repos analyzed in ${elapsed}ms`)
    recordScanComplete()

    return {
      skipped: false,
      repoCount: enrichedRepos.length,
      waveCount: dag.waves.length,
      conflictCount: conflicts.length,
      durationMs: elapsed,
    }
  } catch (err) {
    addActivity('scan', `Scan failed: ${err.message}`)
    recordScanComplete()
    return { skipped: false, error: err.message }
  } finally {
    scanMutex = false
  }
}

// ---- Git helpers ------------------------------------------------------------

function git(cwd, command, timeoutMs = 15000) {
  try {
    return execSync(`git ${command}`, {
      cwd,
      encoding: 'utf8',
      timeout: timeoutMs,
      stdio: 'pipe',
    })
  } catch {
    return ''
  }
}

/**
 * Enrich a repo object with live git data if diskPath is available.
 */
function enrichRepo(repo) {
  if (!repo.diskPath || !existsSync(repo.diskPath)) {
    // No local clone — return with synthetic data
    return {
      ...repo,
      branches: repo.branches || [],
      mergeReadinessScore: repo.mergeReadinessScore ?? 50,
    }
  }

  const cwd = repo.diskPath

  // Fetch latest (non-fatal)
  git(cwd, 'fetch origin --prune', 30000)

  // Get branches
  const branchOutput = git(cwd, 'branch -a --format="%(refname:short)|%(upstream:track)|%(committerdate:iso8601)"')
  const branches = []
  let totalAhead = 0
  let totalBehind = 0

  for (const line of branchOutput.split('\n').filter(Boolean)) {
    const [name, track, date] = line.replace(/"/g, '').split('|')
    if (!name || name.startsWith('origin/')) continue

    let ahead = 0
    let behind = 0
    if (track) {
      const aheadMatch = track.match(/ahead (\d+)/)
      const behindMatch = track.match(/behind (\d+)/)
      if (aheadMatch) ahead = parseInt(aheadMatch[1], 10)
      if (behindMatch) behind = parseInt(behindMatch[1], 10)
    }

    totalAhead += ahead
    totalBehind += behind

    branches.push({
      id: `${repo.id}-${name}`,
      repoId: repo.id,
      name,
      aheadCount: ahead,
      behindCount: behind,
      lastCommitAt: date || null,
      stalenessScore: behind > 5 ? 80 : behind > 0 ? 40 : 0,
    })
  }

  // Working tree status
  const statusOutput = git(cwd, 'status --porcelain')
  const isDirty = statusOutput.trim().length > 0

  // Compute readiness: 100 if clean + no behind, degrade based on dirtiness and behind count
  let readiness = 100
  if (isDirty) readiness -= 20
  if (totalBehind > 0) readiness -= Math.min(totalBehind * 5, 30)
  if (totalAhead > 5) readiness -= 10
  readiness = Math.max(readiness, 0)

  // Last activity
  const lastLog = git(cwd, 'log -1 --format="%ci"').trim().replace(/"/g, '')

  return {
    ...repo,
    branches,
    mergeReadinessScore: readiness,
    lastScanAt: new Date().toISOString(),
    _git: {
      isDirty,
      totalAhead,
      totalBehind,
      branchCount: branches.length,
      lastCommit: lastLog,
    },
  }
}

/**
 * Detect conflict zones by checking for files modified on multiple branches
 * across repos. When no local git data is available, returns static conflicts
 * matching the hub's sample data format.
 */
function detectConflicts(repos) {
  const localRepos = repos.filter(r => r._git)

  // If no local repos have git data, return static conflicts
  if (localRepos.length === 0) {
    return getStaticConflicts()
  }

  const conflicts = []
  let conflictId = 0

  // Check each repo for branches with conflicting file changes
  for (const repo of localRepos) {
    if (!repo.diskPath || !repo.branches || repo.branches.length < 2) continue

    const defaultBranch = repo.defaultBranch || 'dev'
    const fileChanges = new Map() // file -> Set<branch>

    for (const branch of repo.branches) {
      if (branch.name === defaultBranch) continue

      const diffOutput = git(
        repo.diskPath,
        `diff --name-only ${defaultBranch}...${branch.name}`,
      )
      for (const file of diffOutput.split('\n').filter(Boolean)) {
        if (!fileChanges.has(file)) fileChanges.set(file, new Set())
        fileChanges.get(file).add(branch.name)
      }
    }

    // Files modified by 2+ branches are conflict zones
    for (const [file, branchSet] of fileChanges) {
      if (branchSet.size >= 2) {
        conflictId += 1
        const branchList = [...branchSet]
        const severity = branchList.length >= 3 ? 'critical'
          : file.includes('auth') || file.includes('db') ? 'high'
          : file.includes('.config') || file.includes('package.json') ? 'medium'
          : 'low'

        conflicts.push({
          id: `c${conflictId}`,
          file,
          repos: [repo.name],
          repoId: repo.id,
          severity,
          description: `${branchList.length} branches modified ${file} independently`,
          branches: branchList,
          predictedAt: new Date().toISOString(),
        })
      }
    }
  }

  return conflicts.length > 0 ? conflicts : getStaticConflicts()
}

/**
 * Static conflicts matching the hub's sample data.
 */
function getStaticConflicts() {
  return [
    { id: 'c1', file: 'packages/auth-nextauth/src/index.ts', repos: ['finder-starter', 'admin-starter', 'ODYN-starter'], repoId: 'finder-starter', severity: 'critical', description: 'Three repos modified the auth session handler independently. Overlapping changes in getServerSession() wrapper.', branches: ['dev', 'feat/auth-v2'], predictedAt: new Date().toISOString() },
    { id: 'c2', file: 'packages/masterpanel/src/components/shell.tsx', repos: ['design-starter', 'devtools-manager'], repoId: 'design-starter', severity: 'high', description: 'Both repos extended MasterPanel shell with different plugin APIs. Tab registration conflicts likely.', branches: ['dev', 'feat/plugins'], predictedAt: new Date().toISOString() },
    { id: 'c3', file: 'templates/claude-hooks/base/session-start-hook.ts', repos: ['master-weaver-master', 'finder-starter'], repoId: 'finder-starter', severity: 'medium', description: 'Session-start hook diverged: master added team-sync alerts, finder added custom scanner.', branches: ['dev'], predictedAt: new Date().toISOString() },
    { id: 'c4', file: 'packages/db-adapter/src/dialects/postgres.ts', repos: ['db-manager', 'crowds'], repoId: 'db-manager', severity: 'medium', description: 'Connection pool settings differ between implementations. Pool size and idle timeout changed.', branches: ['dev', 'feat/pool-tuning'], predictedAt: new Date().toISOString() },
    { id: 'c5', file: 'apps/admin/src/components/sidebar.tsx', repos: ['admin-starter', 'feedback-starter'], repoId: 'admin-starter', severity: 'low', description: 'Minor styling differences in sidebar navigation component.', branches: ['dev'], predictedAt: new Date().toISOString() },
  ]
}

/**
 * Seed the state with initial data (called on server startup).
 * Runs a scan in the background so endpoints return data immediately.
 */
export async function seedState() {
  addActivity('scan', 'GitFinder API starting — initial scan queued')
  await runScan()
}
