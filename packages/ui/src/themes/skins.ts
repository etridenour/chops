// Skins are palette-based theme overrides that change the visual personality.
// Each skin defines 4 palettes (light base, dark base, light accent, dark accent)
// of 12 colors each — matching the Tamagui theme builder output.
// The same template used for base themes maps palette indices → semantic tokens.
//
// Applied via nested <Theme name="retro"> — Tamagui resolves
// light + retro → light_retro, dark + retro → dark_retro automatically.

export const skinDefinitions = {
  retro: {
    lightPalette: [
      '#faf3e0', '#f5ecd4', '#f0e5c8', '#e8dbb8',
      '#d4a574', '#c49564', '#a08060', '#806048',
      '#604838', '#4a3728', '#3a2718', '#2a1708',
    ],
    darkPalette: [
      '#2a1f14', '#352a1f', '#40352a', '#4b4035',
      '#6b5040', '#7b6050', '#8a7060', '#a89078',
      '#c8b098', '#f0e5d0', '#f5ead5', '#faf0e0',
    ],
    lightAccentPalette: [
      '#fef0d8', '#fce4c0', '#f8d8a8', '#f4cc90',
      '#e8b478', '#dca060', '#d09050', '#c08040',
      '#b07030', '#a06020', '#8a5018', '#744010',
    ],
    darkAccentPalette: [
      '#2a1a08', '#3a2810', '#4a3618', '#5a4420',
      '#6a5230', '#7a6040', '#8a7050', '#a08060',
      '#b89070', '#d0a888', '#e8c8a8', '#f8e8d0',
    ],
  },

  neon: {
    lightPalette: [
      '#0a0a1a', '#0f0f25', '#141430', '#1a1a3c',
      '#202048', '#282858', '#305068', '#407888',
      '#60a0a8', '#00ffcc', '#33ffd6', '#66ffe0',
    ],
    darkPalette: [
      '#050510', '#0a0a1a', '#0f0f25', '#141430',
      '#1a1a3c', '#202048', '#284858', '#386870',
      '#509088', '#00ffcc', '#33ffd6', '#66ffe0',
    ],
    lightAccentPalette: [
      '#1a0a1a', '#250f25', '#301430', '#3c1a3c',
      '#502050', '#682868', '#883080', '#a83898',
      '#c840b0', '#ff00ff', '#ff33ff', '#ff66ff',
    ],
    darkAccentPalette: [
      '#100510', '#1a0a1a', '#250f25', '#301430',
      '#3c1a3c', '#502050', '#682868', '#883080',
      '#a83898', '#ff00ff', '#ff33ff', '#ff66ff',
    ],
  },

  purple: {
    lightPalette: [
      '#f0eae4', '#e6ddd4', '#dcd0c4', '#d0c2b6',
      '#c0b0a0', '#b0a090', '#a09080', '#908070',
      '#807060', '#6a5848', '#504030', '#382818',
    ],
    darkPalette: [
      '#181008', '#241a12', '#30241c', '#3c2e26',
      '#4a3a30', '#58483e', '#68584c', '#78685c',
      '#88786c', '#a89888', '#d0c4b8', '#ede4dc',
    ],
    lightAccentPalette: [
      '#2a1890', '#34229c', '#3e2ca8', '#4838b4',
      '#5444c0', '#6254c8', '#7264d0', '#8476d8',
      '#9688e0', '#b0a0e8', '#ccc0f0', '#ece8fc',
    ],
    darkAccentPalette: [
      '#0c0628', '#141038', '#1c1848', '#242058',
      '#2e2a68', '#383478', '#443e88', '#504898',
      '#5e54a8', '#7e70c0', '#a8a0d8', '#d8d0f0',
    ],
  },

  bw: {
    lightPalette: [
      '#f0f0f0', '#e4e4e4', '#d8d8d8', '#cccccc',
      '#b4b4b4', '#9c9c9c', '#888888', '#747474',
      '#606060', '#484848', '#282828', '#0a0a0a',
    ],
    darkPalette: [
      '#0a0a0a', '#1a1a1a', '#262626', '#323232',
      '#444444', '#5c5c5c', '#707070', '#888888',
      '#a0a0a0', '#b8b8b8', '#d8d8d8', '#f0f0f0',
    ],
    lightAccentPalette: [
      '#f2f2f2', '#e2e2e2', '#d2d2d2', '#c2c2c2',
      '#aaaaaa', '#949494', '#808080', '#6c6c6c',
      '#585858', '#404040', '#222222', '#080808',
    ],
    darkAccentPalette: [
      '#080808', '#181818', '#282828', '#383838',
      '#4e4e4e', '#646464', '#7a7a7a', '#909090',
      '#a6a6a6', '#c0c0c0', '#e0e0e0', '#f4f4f4',
    ],
  },

  ocean: {
    lightPalette: [
      '#eaf0f4', '#dfe6ec', '#d4dce4', '#c8d0dc',
      '#b0bcc8', '#98a8b8', '#8494a8', '#708098',
      '#5c6c88', '#405870', '#283e52', '#142838',
    ],
    darkPalette: [
      '#0a1620', '#14222e', '#1e2e3c', '#28384a',
      '#344858', '#425868', '#506878', '#607888',
      '#708898', '#90a8b8', '#c0d0dc', '#e4eef4',
    ],
    lightAccentPalette: [
      '#e0f0fa', '#c4e0f4', '#a8d0ee', '#8cc0e8',
      '#70b0e0', '#58a0d8', '#4090d0', '#2880c8',
      '#1870b8', '#0c58a0', '#084080', '#042c5c',
    ],
    darkAccentPalette: [
      '#041828', '#082438', '#0c3048', '#103e5c',
      '#184e70', '#206084', '#287298', '#3084ac',
      '#3896c0', '#60b0d8', '#98d0e8', '#d8f0fa',
    ],
  },

  red: {
    lightPalette: [
      '#cc2020', '#d03030', '#d44040', '#c84848',
      '#bc5555', '#b06565', '#c08080', '#d09898',
      '#e0b0b0', '#ecc8c8', '#f2e0e0', '#faf2f2',
    ],
    darkPalette: [
      '#180505', '#280a0a', '#381010', '#481818',
      '#582020', '#682828', '#803838', '#984848',
      '#b05858', '#d07878', '#e8a0a0', '#f0c8c8',
    ],
    lightAccentPalette: [
      '#f5f0f0', '#e8e2e2', '#dbd4d4', '#cec6c6',
      '#b8b0b0', '#a09898', '#8a8282', '#746c6c',
      '#5e5656', '#484040', '#2c2626', '#120e0e',
    ],
    darkAccentPalette: [
      '#100c0c', '#1e1a1a', '#2c2828', '#3a3636',
      '#4c4646', '#605858', '#746c6c', '#8a8282',
      '#a09898', '#b8b0b0', '#d8d0d0', '#f0eaea',
    ],
  },
  cactus: {
    lightPalette: [
      '#f2efe6', '#e8e4d8', '#ded8cc', '#d4ccbe',
      '#c0b8a4', '#acaa90', '#989480', '#88806e',
      '#786e5c', '#5e5640', '#423c28', '#282214',
    ],
    darkPalette: [
      '#12120e', '#201e18', '#2e2a22', '#3a362c',
      '#3c5448', '#4a6860', '#587870', '#6a8878',
      '#7c9884', '#a4b8a0', '#ccd8c4', '#eaf0e4',
    ],
    lightAccentPalette: [
      '#a0d8cc', '#80c4b4', '#78b89c', '#88a878',
      '#a0a460', '#a89c50', '#a89440', '#a08438',
      '#907430', '#7c6028', '#684c1c', '#543810',
    ],
    darkAccentPalette: [
      '#0c1e18', '#183028', '#244038', '#305040',
      '#40604a', '#507254', '#608460', '#789870',
      '#90ac84', '#b0c8a0', '#ccdcbc', '#e8f0dc',
    ],
  },
  neonGreen: {
    lightPalette: [
      '#f0eae4', '#e6ddd4', '#dcd0c4', '#d0c2b6',
      '#c0b0a0', '#b0a090', '#a09080', '#908070',
      '#807060', '#6a5848', '#504030', '#382818',
    ],
    darkPalette: [
      '#181008', '#241a12', '#30241c', '#3c2e26',
      '#4a3a30', '#58483e', '#68584c', '#78685c',
      '#88786c', '#a89888', '#d0c4b8', '#ede4dc',
    ],
    lightAccentPalette: [
      '#d2f830', '#d0f42c', '#cef028', '#ccee24',
      '#c8ea20', '#c6e81c', '#c4e618', '#c0e214',
      '#bcde10', '#5c7c08', '#243204', '#121a02',
    ],
    darkAccentPalette: [
      '#0c1202', '#182604', '#243a08', '#30500c',
      '#3e6610', '#4c7c16', '#5c941c', '#6cac24',
      '#80c42c', '#b0e418', '#c8f024', '#d6f832',
    ],
  },
} as const

export type SkinName = keyof typeof skinDefinitions
