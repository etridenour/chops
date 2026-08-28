import { useEffect, useState } from 'react'
import { Animated, Easing, type ViewStyle } from 'react-native'
import { Drum } from '@tamagui/lucide-icons'
import type { ColorTokens } from 'tamagui'

export interface LoadingDrumProps {
  /** Icon size in pixels. Default: 24 */
  size?: number
  /** Icon color — accepts Tamagui tokens. Default: '$color' */
  color?: ColorTokens
  /** Additional styles for the wrapper */
  style?: ViewStyle
}

export function LoadingDrum({
  size = 24,
  color = '$color',
  style,
}: LoadingDrumProps) {
  const [rotation] = useState(() => new Animated.Value(0))
  const [scale] = useState(() => new Animated.Value(1))

  useEffect(() => {
    const spinDuration = 1200
    const pauseDuration = 400

    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          // Spin: 2 full rotations with ease-in-out
          Animated.timing(rotation, {
            toValue: 1,
            duration: spinDuration,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
          // Pulse: grow then shrink
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.2,
              duration: spinDuration * 0.5,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: false,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: spinDuration * 0.5,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: false,
            }),
          ]),
        ]),
        // Pause between cycles
        Animated.delay(pauseDuration),
        // Reset rotation for next cycle
        Animated.timing(rotation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    )

    animation.start()
    return () => animation.stop()
  }, [rotation, scale])

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  })

  return (
    <Animated.View
      style={[
        {
          transform: [{ rotate }, { scale }],
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Drum size={size} color={color} />
    </Animated.View>
  )
}
