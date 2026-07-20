import { styled, Paragraph } from 'tamagui'

export const Chip = styled(Paragraph, {
  render: 'span',
  fontFamily: '$body',
  fontSize: '$2',
  color: '$colorMuted',
  backgroundColor: '$backgroundMuted',
  paddingHorizontal: '$2',
  paddingVertical: '$1',
  borderRadius: '$round',
})
