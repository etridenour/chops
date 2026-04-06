import { createThemeBuilder } from '@tamagui/theme-builder'
import { lightPalette, darkPalette, lightAccentPalette, darkAccentPalette } from './palettes'
import { skinDefinitions, type SkinName } from './skins'

const palettes = {
  light: lightPalette,
  dark: darkPalette,
  light_accent: lightAccentPalette,
  dark_accent: darkAccentPalette,
}

// Template maps palette indices to semantic theme keys.
// These become the $-prefixed theme values used in components.
const template = {
  // Backgrounds
  background: 0,
  backgroundHover: 1,
  backgroundPress: 2,
  backgroundFocus: 1,
  backgroundStrong: 9,       // for primary buttons (dark on light, light on dark)
  backgroundStrongHover: 10,
  backgroundStrongPress: 11,
  backgroundMuted: 3,        // for secondary elements
  backgroundMutedHover: 4,
  backgroundMutedPress: 5,

  // Text colors
  color: 9,                  // primary text
  colorHover: 10,
  colorPress: 11,
  colorFocus: 10,
  colorInverse: 0,           // text on strong backgrounds
  colorMuted: 7,             // secondary text (#666 / #999)
  colorSubtle: 6,            // hints, placeholders

  // Borders
  borderColor: 4,
  borderColorHover: 5,
  borderColorPress: 6,
  borderColorFocus: 9,       // focus ring uses strong color

  // Other
  outlineColor: 9,
  placeholderColor: 6,
  shadowColor: 0,
}

const themesBuilder = createThemeBuilder()
  .addPalettes(palettes)
  .addTemplates({ base: template })
  .addThemes({
    light: {
      template: 'base',
      palette: 'light',
    },
    dark: {
      template: 'base',
      palette: 'dark',
    },
  })

const baseThemes = themesBuilder.build()

// Build skin sub-themes by applying the same template to skin palettes
function buildSkinThemes() {
  const skinThemes: Record<string, Record<string, string>> = {}
  const keys = Object.keys(template) as (keyof typeof template)[]

  for (const [skinName, skin] of Object.entries(skinDefinitions)) {
    for (const [themeName, palette] of [
      [`light_${skinName}`, skin.lightPalette],
      [`dark_${skinName}`, skin.darkPalette],
      [`light_${skinName}_accent`, skin.lightAccentPalette],
      [`dark_${skinName}_accent`, skin.darkAccentPalette],
    ] as const) {
      const theme: Record<string, string> = {}
      for (const key of keys) {
        theme[key] = palette[template[key]]
      }
      skinThemes[themeName] = theme
    }
  }

  return skinThemes
}

// Build accent sub-themes from accent palettes using the same template
function buildAccentThemes() {
  const accentThemes: Record<string, Record<string, string>> = {}
  const keys = Object.keys(template) as (keyof typeof template)[]

  for (const [themeName, palette] of [
    ['light_accent', lightAccentPalette],
    ['dark_accent', darkAccentPalette],
  ] as const) {
    const theme: Record<string, string> = {}
    for (const key of keys) {
      theme[key] = palette[template[key]]
    }
    accentThemes[themeName] = theme
  }

  return accentThemes
}

export const themes = {
  ...baseThemes,
  ...buildSkinThemes(),
  ...buildAccentThemes(),
}

export { type SkinName }
export const skinNames = Object.keys(skinDefinitions) as SkinName[]
