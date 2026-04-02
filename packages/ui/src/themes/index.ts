import { createThemeBuilder } from '@tamagui/theme-builder'
import { lightPalette, darkPalette } from './palettes'
import { skinDefinitions, type SkinName } from './skins'

const palettes = {
  light: lightPalette,
  dark: darkPalette,
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

// Build skin sub-themes from skin definitions
function buildSkinThemes() {
  const skinThemes: Record<string, Record<string, string>> = {}

  for (const [skinName, skin] of Object.entries(skinDefinitions)) {
    skinThemes[`light_${skinName}`] = skin.light
    skinThemes[`dark_${skinName}`] = skin.dark
  }

  return skinThemes
}

export const themes = {
  ...baseThemes,
  ...buildSkinThemes(),
}

export { type SkinName }
export const skinNames = Object.keys(skinDefinitions) as SkinName[]
