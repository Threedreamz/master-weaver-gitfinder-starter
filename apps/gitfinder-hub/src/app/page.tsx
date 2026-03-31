export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">GitFinder</h1>
      <p className="text-zinc-400 text-lg mb-8">DAG-Based Smart Merge Orchestration</p>
      <div className="grid grid-cols-2 gap-4">
        <a href="/repos" className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 hover:border-blue-500 transition">
          <h2 className="text-xl font-semibold mb-2">Repositories</h2>
          <p className="text-zinc-400 text-sm">Browse all ecosystem repos with merge readiness</p>
        </a>
        <a href="/dag" className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 hover:border-blue-500 transition">
          <h2 className="text-xl font-semibold mb-2">Merge DAG</h2>
          <p className="text-zinc-400 text-sm">Visual dependency graph with wave execution</p>
        </a>
        <a href="/conflicts" className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 hover:border-red-500 transition">
          <h2 className="text-xl font-semibold mb-2">Conflicts</h2>
          <p className="text-zinc-400 text-sm">Predicted conflict zones and AI resolution</p>
        </a>
        <a href="/waves" className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 hover:border-green-500 transition">
          <h2 className="text-xl font-semibold mb-2">Merge Waves</h2>
          <p className="text-zinc-400 text-sm">Topologically sorted execution plan</p>
        </a>
      </div>
    </main>
  )
}
