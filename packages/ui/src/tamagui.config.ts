import { createTamagui } from 'tamagui'
import { tokens } from './tokens'
import { themes } from './themes'
import { bodyFont, headingFont } from './fonts'

const config = createTamagui({
  tokens,
  themes,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
  media: {
    xs: { maxWidth: 480 },
    sm: { maxWidth: 768 },
    md: { maxWidth: 1024 },
    lg: { maxWidth: 1280 },
    xl: { minWidth: 1281 },
    short: { maxHeight: 820 },
    tall: { minHeight: 821 },
    hoverable: { hover: 'hover' },
    touchable: { pointer: 'coarse' },
  },
  shorthands: {
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    f: 'flex',
    w: 'width',
    h: 'height',
    bg: 'backgroundColor',
    br: 'borderRadius',
  } as const,
  settings: {
    allowedStyleValues: 'somewhat-strict-web',
  },
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
