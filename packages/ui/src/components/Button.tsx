import type { ReactNode, JSX } from 'react'
import { View, Text, type ViewProps } from 'tamagui'
import { useTheme } from '@tamagui/core'
import { LoadingDrum } from './LoadingDrum'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<ViewProps, 'children'> {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  onPress?: () => void
}

const sizeStyles = {
  sm: { py: '$2' as const, px: '$3' as const, fontSize: 14 },
  md: { py: '$3' as const, px: '$4' as const, fontSize: 16 },
  lg: { py: '$4' as const, px: '$6' as const, fontSize: 18 },
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  disabled,
  loading,
  onPress,
  ...rest
}: ButtonProps): JSX.Element {
  const theme = useTheme()
  const s = sizeStyles[size]
  const isDisabled = disabled || loading

  const variantStyles = {
    primary: {
      bg: '$backgroundStrong' as const,
      color: '$colorInverse' as const,
    },
    secondary: {
      bg: '$backgroundMuted' as const,
      color: '$color' as const,
    },
    ghost: {
      bg: 'transparent' as const,
      color: '$colorMuted' as const,
    },
  }

  const v = variantStyles[variant]

  return (
    <View
      render="button"
      backgroundColor={v.bg}
      paddingVertical={s.py}
      paddingHorizontal={s.px}
      borderRadius="$2"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      opacity={isDisabled ? 0.5 : 1}
      width={fullWidth ? '100%' : undefined}
      onPress={isDisabled ? undefined : onPress}
      pressStyle={{ opacity: 0.8, scale: 0.97 }}
      hoverStyle={{ opacity: 0.9 }}
      borderWidth={0}
      {...rest}
    >
      {loading ? (
        <LoadingDrum size={s.fontSize} color={v.color} />
      ) : typeof children === 'string' ? (
        <Text color={v.color} fontSize={s.fontSize} fontWeight="600">
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  )
}
