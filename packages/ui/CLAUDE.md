# UI — Tamagui Design System

## Purpose

Cross-platform component library shared by web and mobile. Single source of truth for tokens, themes, and components.

## Token Rules

- Always use `$` tokens: `$space.4`, `$color`, `$fontSize.3`, `$radius.2`, etc.
- Never hardcode colors, spacing, or font sizes.
- See `src/tokens.ts` for all available tokens.

## Theming

- Light/dark themes auto-resolve based on system preference.
- Skins (retro, neon) overlay on the active theme — use `SkinProvider` + `useSkin()`.
- Use semantic colors (`$background`, `$color`, `$colorMuted`, `$borderColor`, `$placeholderColor`) — not raw palette values.

## Component Patterns

- Extend Tamagui primitives with `styled()` when creating new components.
- Keep components simple and single-responsibility.
- Export everything through `src/index.ts` barrel file.

## Existing Components

- **Button** — variants: primary, secondary, ghost. Sizes: sm, md, lg. Props: fullWidth, disabled.
- **Input** — props: error (red border), placeholder, secureTextEntry, autoCapitalize
- **Text** — H1, H2, Body, Label, ErrorText, LinkText
- **Layout** — YStack, XStack, View, Separator, Spinner (re-exported from Tamagui)
- **Skin** — SkinProvider, useSkin, SkinSelector

## After Changes

Run `pnpm build` then verify on both web (`pnpm dev:web`) and mobile (`pnpm dev:mobile`).

## Reference

See [docs/THEMING.md](../../docs/THEMING.md) for the full theming guide.
