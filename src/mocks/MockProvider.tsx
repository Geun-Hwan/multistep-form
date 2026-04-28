'use client'

import { useEffect, useState } from 'react'

async function initMocks() {
  if (typeof window === 'undefined') return
  const { worker } = await import('./browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

export default function MockProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initMocks().then(() => setReady(true))
  }, [])

  if (!ready) return null

  return <>{children}</>
}
