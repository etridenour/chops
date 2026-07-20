export { default as tamaguiConfig } from "./tamagui.config";
export type { AppConfig } from "./tamagui.config";
export { tokens } from "./tokens";
export { themes, skinNames } from "./themes";
export type { SkinName } from "./themes";
export { bodyFont, headingFont } from "./fonts";

// Components
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";
export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";
export { H1, H2, Body, Label, ErrorText, LinkText } from "./components/Text";
export { SkinSelector } from "./components/SkinSelector";
export { LoadingDrum } from "./components/LoadingDrum";
export type { LoadingDrumProps } from "./components/LoadingDrum";
export { ToggleGroup } from "./components/ToggleGroup";
export { ConfirmDialog } from "./components/ConfirmDialog";

// Providers
export { SkinProvider, useSkin } from "./providers/SkinProvider";

// Re-export core Tamagui primitives for convenience
export {
  TamaguiProvider,
  Theme,
  XStack,
  YStack,
  View,
  Separator,
  Spinner,
  Sheet,
  Popover,
  AlertDialog,
} from "tamagui";
export { useTheme, useMedia } from "@tamagui/core";

// Icons
export {
  Eye,
  EyeOff,
  Drum,
  Menu,
  X,
  Home,
  LogOut,
  MoreVertical,
  ChevronLeft,
} from "@tamagui/lucide-icons";

// Error state
export { ErrorState } from "./components/ErrorState";
export type { ErrorStateProps } from "./components/ErrorState";

export { Skeleton } from "./components/Skeleton";
