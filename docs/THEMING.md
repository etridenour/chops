# Theming & Skins Guide

This project uses [Tamagui](https://tamagui.dev) for cross-platform theming. One config drives both the Next.js web app and the Expo React Native mobile app.

## Architecture

```
packages/ui/src/
  tamagui.config.ts    ← central config (tokens + themes + fonts + media)
  tokens.ts            ← design tokens (color, space, size, radius)
  fonts.ts             ← font definitions (body, heading)
  themes/
    palettes.ts        ← 12-step light/dark color palettes
    skins.ts           ← skin overlay definitions (retro, neon)
    index.ts           ← assembles themes + skins
  components/          ← shared styled components
  providers/           ← SkinProvider
```

All UI components and theming are exported from `@chops/ui`.

---

## Using Tokens

Tokens are referenced with `$` prefix in component props:

```tsx
import { YStack, Body } from "@chops/ui";

<YStack padding="$4" borderRadius="$2" backgroundColor="$background">
  <Body color="$colorMuted" fontSize="$2">Secondary text</Body>
</YStack>
```

### Available Token Scales

| Token       | Values                                  | Default (`true`) |
|-------------|----------------------------------------|-------------------|
| `$space`    | `$0`–`$10` (0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64) | `$4` (16px)   |
| `$size`     | `$0`–`$12`                              | `$true` (44px)    |
| `$radius`   | `$0`–`$6`, `$round` (9999)             | `$true` (8px)     |
| `$fontSize` | `$1`–`$5` (body), `$1`–`$7` (heading)  | `$3` (16px body)  |

### Semantic Theme Colors

These resolve differently in light vs dark mode:

| Token              | Light Mode | Dark Mode | Use For                |
|--------------------|-----------|-----------|-----------------------|
| `$background`      | white     | near-black | page/container bg     |
| `$color`           | dark gray | light gray | primary text          |
| `$colorMuted`      | `#666`    | `#999`     | secondary/muted text  |
| `$borderColor`     | `#ccc`    | `#333`     | input/card borders    |
| `$placeholderColor`| `#999`    | `#777`     | input placeholders    |

---

## Shared Components

Import from `@chops/ui`:

```tsx
import { Button, Input, H1, H2, Body, Label, ErrorText, LinkText } from "@chops/ui";
```

### Button

```tsx
<Button variant="primary" size="md" fullWidth onPress={handlePress}>
  Submit
</Button>
```

| Prop | Values | Default |
|------|--------|---------|
| `variant` | `"primary"`, `"secondary"`, `"ghost"` | `"primary"` |
| `size` | `"sm"`, `"md"`, `"lg"` | `"md"` |
| `fullWidth` | `true` / omit | — |

### Input

```tsx
<Input
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  autoCapitalize="none"
/>
```

### Text Variants

| Component   | Renders As | Font Size | Use For            |
|-------------|-----------|-----------|---------------------|
| `H1`        | `<h1>`    | 32px      | Page titles         |
| `H2`        | `<h2>`    | 28px      | Section titles      |
| `Body`      | `<p>`     | 16px      | Body text           |
| `Label`     | `<label>` | 14px      | Form labels         |
| `ErrorText` | `<span>`  | 14px      | Validation errors   |
| `LinkText`  | `<span>`  | 14px      | Clickable text links|

### Layout Primitives

```tsx
import { YStack, XStack, Stack, Separator, Spinner } from "@chops/ui";

<YStack gap="$3" padding="$4">  {/* vertical stack */}
  <XStack gap="$2">              {/* horizontal stack */}
    <Spinner />
  </XStack>
  <Separator />
</YStack>
```

---

## Themes (Light/Dark)

Themes switch automatically based on system preference (mobile) or user toggle (web via `@tamagui/next-theme`).

All semantic tokens (`$background`, `$color`, `$borderColor`, etc.) resolve differently per theme — you never need conditional logic for light/dark.

### Using `useTheme()`

```tsx
import { useTheme } from "@chops/ui";

function MyComponent() {
  const theme = useTheme();
  // theme.background.val → current resolved hex value
  // theme.color.val → current resolved text color
}
```

---

## Skins

Skins overlay on top of the active theme, changing the visual personality without changing the light/dark base.

### How It Works

Skins use Tamagui's nested `<Theme>` resolution:
- `<Theme name="retro">` inside a `light` context resolves to the `light_retro` theme
- The same `<Theme name="retro">` inside `dark` resolves to `dark_retro`

### Using the Skin System

```tsx
import { useSkin, SkinSelector } from "@chops/ui";

function SettingsScreen() {
  const { skin, setSkin, availableSkins } = useSkin();

  return (
    <>
      <Body>Current skin: {skin ?? "Default"}</Body>
      <SkinSelector />  {/* pre-built button row */}
    </>
  );
}
```

### Available Skins

| Skin    | Description                         |
|---------|-------------------------------------|
| Default | Clean neutral palette (no overlay)  |
| Retro   | Warm sepia tones, analog feel       |
| Neon    | Vibrant electric colors, dark base  |

### Creating a New Skin

1. Add your skin definition to `packages/ui/src/themes/skins.ts`:

```typescript
export const skinDefinitions = {
  // ...existing skins...
  ocean: {
    light: {
      background: '#e8f4f8',
      backgroundHover: '#d4ecf1',
      backgroundPress: '#c0e4ea',
      backgroundFocus: '#d4ecf1',
      color: '#1a3a4a',
      colorHover: '#0f2a3a',
      colorPress: '#041a2a',
      colorFocus: '#0f2a3a',
      borderColor: '#7ab8cc',
      borderColorHover: '#6aa8bc',
      borderColorPress: '#5a98ac',
      borderColorFocus: '#6aa8bc',
      placeholderColor: '#6a98a8',
      shadowColor: 'rgba(26, 58, 74, 0.15)',
    },
    dark: {
      // dark variant...
    },
  },
}
```

2. That's it — the build system auto-generates `light_ocean` and `dark_ocean` themes, and `SkinSelector` picks it up automatically.

---

## Styled Components

Create new styled components using Tamagui's `styled()`:

```tsx
import { styled, GetProps } from 'tamagui'
import { Stack } from 'tamagui'

export const Card = styled(Stack, {
  name: 'Card',
  backgroundColor: '$background',
  borderRadius: '$2',
  padding: '$4',
  borderWidth: 1,
  borderColor: '$borderColor',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,

  variants: {
    size: {
      sm: { padding: '$3' },
      md: { padding: '$4' },
      lg: { padding: '$6' },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

export type CardProps = GetProps<typeof Card>
```

Add new components to `packages/ui/src/components/index.ts` and `packages/ui/src/index.ts`.

---

## Media Queries

```tsx
import { useMedia } from "@chops/ui";

function ResponsiveLayout() {
  const media = useMedia();

  return (
    <YStack padding={media.sm ? "$3" : "$6"}>
      {/* compact on small screens */}
    </YStack>
  );
}
```

Or inline with Tamagui's `$` media props:

```tsx
<YStack padding="$6" $sm={{ padding: "$3" }}>
```

### Breakpoints

| Name    | Condition            |
|---------|---------------------|
| `xs`    | max-width: 480px    |
| `sm`    | max-width: 768px    |
| `md`    | max-width: 1024px   |
| `lg`    | max-width: 1280px   |
| `xl`    | min-width: 1281px   |

---

## Shorthands

For convenience, these shorthand props are available:

| Shorthand | Full Property        |
|-----------|---------------------|
| `px`      | `paddingHorizontal` |
| `py`      | `paddingVertical`   |
| `mx`      | `marginHorizontal`  |
| `my`      | `marginVertical`    |
| `f`       | `flex`              |
| `w`       | `width`             |
| `h`       | `height`            |
| `bg`      | `backgroundColor`   |
| `br`      | `borderRadius`      |

---

## Platform Notes

### Web (Next.js)

- Wrap form content with native `<form>` elements for semantic HTML:
  ```tsx
  <form onSubmit={handleSubmit}>
    <YStack gap="$3">
      {/* form fields */}
    </YStack>
  </form>
  ```
- Use native HTML elements (`<main>`, `<section>`) when semantic markup is needed
- `Input` renders as `<input>` on web — standard HTML attributes work

### Mobile (Expo)

- Wrap scrollable forms with `KeyboardAvoidingView` from React Native
- Use `onChangeText` (not `onChange`) for `Input` — it provides the string directly
- `Spinner` from `@chops/ui` replaces `ActivityIndicator`
