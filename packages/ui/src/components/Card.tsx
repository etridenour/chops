import { styled, YStack } from 'tamagui'

export const Card = styled(YStack, {
  backgroundColor: '$backgroundMuted',
  borderRadius: '$3',
  padding: '$4',
  gap: '$3',
  hoverStyle: { backgroundColor: '$backgroundMutedHover' },
})
