'use client'

import { type ReactNode } from 'react'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { TamaguiProvider } from 'tamagui'
import { tamaguiConfig, SkinProvider } from '@chops/ui'

export function NextTamaguiProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useRootTheme({ fallback: 'dark' })

  return (
    <NextThemeProvider
      skipNextHead
      defaultTheme="dark"
      onChangeTheme={(next) => setTheme(next as 'light' | 'dark')}
    >
      <TamaguiProvider
        config={tamaguiConfig}
        defaultTheme={theme || 'dark'}
      >
        <SkinProvider>{children}</SkinProvider>
      </TamaguiProvider>
    </NextThemeProvider>
  )
}
