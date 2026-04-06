import { createFont } from 'tamagui'

export const bodyFont = createFont({
  family: 'Inter',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    true: 16,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 24,
    4: 28,
    5: 32,
    true: 24,
  },
  weight: {
    1: '400',
    2: '500',
    3: '600',
    4: '700',
    true: '400',
  },
  letterSpacing: {
    1: 0,
    2: -0.25,
    3: -0.5,
    true: 0,
  },
})

export const headingFont = createFont({
  family: 'Inter',
  size: {
    1: 18,
    2: 20,
    3: 24,
    4: 28,
    5: 32,
    6: 40,
    7: 48,
    true: 28,
  },
  lineHeight: {
    1: 24,
    2: 28,
    3: 32,
    4: 36,
    5: 42,
    6: 52,
    7: 62,
    true: 36,
  },
  weight: {
    1: '600',
    2: '700',
    true: '700',
  },
  letterSpacing: {
    1: 0,
    2: -0.5,
    3: -1,
    true: -0.5,
  },
})
