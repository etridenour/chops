// 12-step palettes from lightest to darkest
// Used by the theme system to generate semantic color mappings

export const lightPalette = [
  '#ffffff', // 0  background
  '#f8f8f8', // 1  surface1
  '#f0f0f0', // 2  surface2
  '#e8e8e8', // 3  surface3
  '#cccccc', // 4  borderColor
  '#aaaaaa', // 5  muted
  '#999999', // 6  placeholder
  '#666666', // 7  secondary text
  '#444444', // 8
  '#333333', // 9  primary text / buttons
  '#222222', // 10
  '#000000', // 11 strongest
]

export const darkPalette = [
  '#050505', // 0  background
  '#151515', // 1  surface1
  '#1a1a1a', // 2  surface2
  '#222222', // 3  surface3
  '#333333', // 4  borderColor
  '#555555', // 5  muted
  '#777777', // 6  placeholder
  '#999999', // 7  secondary text
  '#bbbbbb', // 8
  '#dddddd', // 9  primary text
  '#eeeeee', // 10
  '#ffffff', // 11 strongest
]

// Accent palettes — replace these arrays with output from the Tamagui theme builder.
// Each array must have exactly 12 colors, lightest to darkest (light) or darkest to lightest (dark).
export const lightAccentPalette = [
  '#FFF3E0', // 0  lightest accent bg
  '#FFE0B2', // 1
  '#FFCC80', // 2
  '#FFB74D', // 3
  '#FFA726', // 4
  '#FF9800', // 5
  '#FF8A33', // 6
  '#FF6B00', // 7  brand
  '#E65100', // 8
  '#CC5500', // 9  brand dark
  '#BF360C', // 10
  '#8D2400', // 11 strongest
]

export const darkAccentPalette = [
  '#1A0A00', // 0  darkest accent bg
  '#2A1500', // 1
  '#3D2000', // 2
  '#4E2A00', // 3
  '#663600', // 4
  '#804400', // 5
  '#995200', // 6
  '#CC5500', // 7  brand dark
  '#FF6B00', // 8  brand
  '#FF8A33', // 9  brand light
  '#FFB74D', // 10
  '#FFE0B2', // 11 strongest
]
