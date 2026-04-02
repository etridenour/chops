// Skins are partial theme overrides that change the visual personality.
// Applied via nested <Theme name="retro"> — Tamagui resolves
// light + retro → light_retro, dark + retro → dark_retro automatically.

export const skinDefinitions = {
  retro: {
    light: {
      background: '#faf3e0',
      backgroundHover: '#f5ecd4',
      backgroundPress: '#f0e5c8',
      backgroundFocus: '#f5ecd4',
      color: '#4a3728',
      colorHover: '#3a2718',
      colorPress: '#2a1708',
      colorFocus: '#3a2718',
      borderColor: '#d4a574',
      borderColorHover: '#c49564',
      borderColorPress: '#b48554',
      borderColorFocus: '#c49564',
      placeholderColor: '#a08060',
      shadowColor: 'rgba(74, 55, 40, 0.15)',
    },
    dark: {
      background: '#2a1f14',
      backgroundHover: '#352a1f',
      backgroundPress: '#40352a',
      backgroundFocus: '#352a1f',
      color: '#f0e5d0',
      colorHover: '#f5ead5',
      colorPress: '#faf0e0',
      colorFocus: '#f5ead5',
      borderColor: '#6b5040',
      borderColorHover: '#7b6050',
      borderColorPress: '#8b7060',
      borderColorFocus: '#7b6050',
      placeholderColor: '#8a7060',
      shadowColor: 'rgba(0, 0, 0, 0.4)',
    },
  },

  neon: {
    light: {
      background: '#0a0a1a',
      backgroundHover: '#0f0f25',
      backgroundPress: '#141430',
      backgroundFocus: '#0f0f25',
      color: '#00ffcc',
      colorHover: '#33ffd6',
      colorPress: '#66ffe0',
      colorFocus: '#33ffd6',
      borderColor: '#ff00ff',
      borderColorHover: '#ff33ff',
      borderColorPress: '#ff66ff',
      borderColorFocus: '#ff33ff',
      placeholderColor: '#6666ff',
      shadowColor: 'rgba(0, 255, 204, 0.3)',
    },
    dark: {
      background: '#050510',
      backgroundHover: '#0a0a1a',
      backgroundPress: '#0f0f25',
      backgroundFocus: '#0a0a1a',
      color: '#00ffcc',
      colorHover: '#33ffd6',
      colorPress: '#66ffe0',
      colorFocus: '#33ffd6',
      borderColor: '#ff00ff',
      borderColorHover: '#ff33ff',
      borderColorPress: '#ff66ff',
      borderColorFocus: '#ff33ff',
      placeholderColor: '#6666ff',
      shadowColor: 'rgba(255, 0, 255, 0.3)',
    },
  },
} as const

export type SkinName = keyof typeof skinDefinitions
