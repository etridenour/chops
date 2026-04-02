import type { JSX } from 'react'
import { Input as TamaguiInput, type InputProps as TamaguiInputProps } from 'tamagui'

export interface InputProps extends TamaguiInputProps {
  error?: boolean
}

export function Input({ error, ...props }: InputProps): JSX.Element {
  return (
    <TamaguiInput
      borderWidth={1}
      borderColor={error ? 'red' : '$borderColor'}
      borderRadius="$2"
      padding="$3"
      fontSize="$3"
      backgroundColor="$background"
      color="$color"
      placeholderTextColor="$placeholderColor"
      focusStyle={{
        borderColor: '$borderColorFocus',
      }}
      {...props}
    />
  )
}
