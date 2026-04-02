import type { ReactNode, JSX } from 'react'
import { createContext, useContext, useState } from 'react'
import { Theme, type ThemeName } from 'tamagui'
import { type SkinName, skinNames } from '../themes'

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
  const [skin, setSkin] = useState<SkinName | null>(defaultSkin)

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
