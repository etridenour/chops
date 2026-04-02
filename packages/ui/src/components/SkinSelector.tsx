import type { JSX } from 'react'
import { XStack } from 'tamagui'
import { Button } from './Button'
import { useSkin } from '../providers/SkinProvider'

export function SkinSelector(): JSX.Element {
  const { skin, setSkin, availableSkins } = useSkin()

  return (
    <XStack gap="$2" flexWrap="wrap">
      <Button
        variant={skin === null ? 'primary' : 'secondary'}
        size="sm"
        onPress={() => setSkin(null)}
      >
        Default
      </Button>
      {availableSkins.map((s) => (
        <Button
          key={s}
          variant={skin === s ? 'primary' : 'secondary'}
          size="sm"
          onPress={() => setSkin(s)}
        >
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </Button>
      ))}
    </XStack>
  )
}
