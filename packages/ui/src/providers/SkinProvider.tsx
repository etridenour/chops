import type { ReactNode, JSX } from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { Theme, type ThemeName } from 'tamagui'
import { type SkinName, skinNames } from '../themes'

const STORAGE_KEY = 'chops-skin'

function getStoredSkin(): SkinName | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && skinNames.includes(stored as SkinName)) {
    return stored as SkinName
  }
  return null
}

interface SkinContextValue {
  skin: SkinName | null
  setSkin: (skin: SkinName | null) => void
  availableSkins: readonly SkinName[]
}

const SkinContext = createContext<SkinContextValue>({
  skin: null,
  setSkin: () => {},
  availableSkins: skinNames,
})

export function SkinProvider({
  children,
  defaultSkin = null,
}: {
  children: ReactNode
  defaultSkin?: SkinName | null
}): JSX.Element {
  const [skin, setSkinState] = useState<SkinName | null>(defaultSkin)

  useEffect(() => {
    const stored = getStoredSkin()
    if (stored) setSkinState(stored)
  }, [])

  const setSkin = (next: SkinName | null) => {
    setSkinState(next)
    if (typeof window !== 'undefined') {
      if (next) {
        localStorage.setItem(STORAGE_KEY, next)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  return (
    <SkinContext.Provider value={{ skin, setSkin, availableSkins: skinNames }}>
      {skin ? (
        <Theme name={skin as unknown as ThemeName}>{children}</Theme>
      ) : (
        children
      )}
    </SkinContext.Provider>
  )
}

export function useSkin(): SkinContextValue {
  return useContext(SkinContext)
}
