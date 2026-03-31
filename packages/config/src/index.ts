// @mw/gitfinder-config — configuration constants for the GitFinder ecosystem

export const GITFINDER_VERSION = '0.1.0'

export const GITFINDER_PORTS = {
  hub: 4630,
  api: 4631,
  worker: 4632,
} as const

export const GITFINDER_APPS = [
  { name: 'gitfinder-hub', port: GITFINDER_PORTS.hub, description: 'DAG canvas dashboard' },
  { name: 'gitfinder-api', port: GITFINDER_PORTS.api, description: 'REST API for merge analysis' },
  { name: 'gitfinder-worker', port: GITFINDER_PORTS.worker, description: 'Background merge worker' },
] as const
