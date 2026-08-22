import { type ReactNode, type JSX, forwardRef } from "react";
import { View, Text, type ViewProps } from "tamagui";
import { TamaguiElement, useTheme } from "@tamagui/core";
import { LoadingDrum } from "./LoadingDrum";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<ViewProps, "children"> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
}

const sizeStyles = {
  sm: { py: "$2" as const, px: "$3" as const, fontSize: 14 },
  md: { py: "$3" as const, px: "$4" as const, fontSize: 16 },
  lg: { py: "$4" as const, px: "$6" as const, fontSize: 18 },
};

export const Button = forwardRef<TamaguiElement, ButtonProps>(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    fullWidth,
    disabled,
    loading,
    onPress,
    ...rest
  },
  ref,
) {
  const theme = useTheme();
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  const variantStyles = {
    primary: {
      bg: "$backgroundStrong" as const,
      color: "$colorInverse" as const,
    },
    secondary: {
      bg: "$backgroundMuted" as const,
      color: "$color" as const,
    },
    ghost: {
      bg: "transparent" as const,
      color: "$colorMuted" as const,
    },
  };

  const v = variantStyles[variant];

  return (
    <View
      ref={ref}
      // `render` is web-only — on native this stays a plain View, so `role`
      // is what gives it button semantics there. Redundant on web, harmless.
      render="button"
      role="button"
      aria-disabled={isDisabled ? true : undefined}
      aria-busy={loading ? true : undefined}
      // Loading swaps the label for the drum, taking the accessible name with
      // it. Hold onto the original so the button still announces as itself.
      aria-label={loading && typeof children === "string" ? children : undefined}
      backgroundColor={v.bg}
      paddingVertical={s.py}
      paddingHorizontal={s.px}
      borderRadius="$2"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      opacity={isDisabled ? 0.5 : 1}
      width={fullWidth ? "100%" : undefined}
      onPress={isDisabled ? undefined : onPress}
      pressStyle={{ opacity: 0.8, scale: 0.97 }}
      hoverStyle={{ opacity: 0.9 }}
      borderWidth={0}
      {...rest}
    >
      {loading ? (
        <LoadingDrum size={s.fontSize} color={v.color} />
      ) : typeof children === "string" ? (
        <Text color={v.color} fontSize={s.fontSize} fontWeight="600">
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
});
