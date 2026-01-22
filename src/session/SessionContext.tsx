// src/session/SessionContext.tsx

import { createContext, useContext, useState } from 'react'
import { sessionState } from './SessionStore'

type SessionApi = {
  state: typeof sessionState
  notify: () => void
  clearSession: () => void
}

const SessionContext = createContext<SessionApi | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [, setTick] = useState(0)

  const api: SessionApi = {
    state: sessionState,
    notify() {
      setTick(t => t + 1)
    },
    clearSession() {
      Object.values(sessionState.books).forEach(book =>
        Object.values(book).forEach(url => URL.revokeObjectURL(url))
      )
      sessionState.books = {}
      setTick(t => t + 1)
    },
  }

  return (
    <SessionContext.Provider value={api}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error('useSession must be used inside SessionProvider')
  }
  return ctx
}
