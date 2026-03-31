import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GitFinder — DAG Smart Merge',
  description: 'Visual merge orchestration for multi-repo ecosystems',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  )
}
