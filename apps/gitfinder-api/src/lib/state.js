/**
 * In-memory state store for the gitfinder API.
 *
 * Holds repos, waves, conflicts, scan metadata, and an activity log.
 * No persistence — state resets on restart and gets populated by scans.
 */

/** @type {Map<string, object>} */
const repos = new Map()

/** @type {object[]} */
let waves = []

/** @type {object[]} */
let conflicts = []

/** @type {object[]} */
let dependencies = []

/** @type {{ lastScanAt: string|null, scanCount: number, scanning: boolean }} */
const scanMeta = {
  lastScanAt: null,
  scanCount: 0,
  scanning: false,
}

/** Activity log — ring buffer capped at 50 entries */
const MAX_ACTIVITY = 50
/** @type {object[]} */
let activity = []
let activityCounter = 0

// ---- Repos ------------------------------------------------------------------

export function setRepos(repoList) {
  repos.clear()
  for (const r of repoList) {
    repos.set(r.id, r)
  }
}

export function getRepos() {
  return [...repos.values()]
}

export function getRepo(id) {
  return repos.get(id) ?? null
}

export function updateRepo(id, partial) {
  const existing = repos.get(id)
  if (existing) {
    repos.set(id, { ...existing, ...partial })
  }
}

// ---- Waves ------------------------------------------------------------------

export function setWaves(waveList) {
  waves = waveList
}

export function getWaves() {
  return waves
}

// ---- Conflicts --------------------------------------------------------------

export function setConflicts(conflictList) {
  conflicts = conflictList
}

export function getConflicts() {
  return conflicts
}

// ---- Dependencies -----------------------------------------------------------

export function setDependencies(depList) {
  dependencies = depList
}

export function getDependencies() {
  return dependencies
}

// ---- Scan metadata ----------------------------------------------------------

export function getScanMeta() {
  return { ...scanMeta }
}

export function setScanningState(scanning) {
  scanMeta.scanning = scanning
}

export function recordScanComplete() {
  scanMeta.lastScanAt = new Date().toISOString()
  scanMeta.scanCount += 1
  scanMeta.scanning = false
}

// ---- Activity log -----------------------------------------------------------

export function addActivity(type, message, repo = undefined) {
  activityCounter += 1
  const entry = {
    id: `a${activityCounter}`,
    type,
    message,
    repo,
    timestamp: new Date().toISOString(),
  }
  activity.unshift(entry)
  if (activity.length > MAX_ACTIVITY) {
    activity = activity.slice(0, MAX_ACTIVITY)
  }
  return entry
}

export function getActivity(limit = 20) {
  return activity.slice(0, limit)
}
