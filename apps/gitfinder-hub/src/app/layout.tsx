import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from './components/sidebar'

export const metadata: Metadata = {
  title: 'GitFinder — DAG Smart Merge Orchestration',
  description: 'Visual merge orchestration for multi-repo ecosystems',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-0 md:ml-56">
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
          <footer className="border-t border-zinc-800/50 px-6 py-3 text-xs text-zinc-500 flex items-center justify-between">
            <span>GitFinder v0.1.0 — Master Weaver Ecosystem</span>
            <span>DAG-Based Smart Merge Orchestration</span>
          </footer>
        </div>
      </body>
    </html>
  )
}
