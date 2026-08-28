import { createTamagui } from "tamagui";
import { createAnimations } from "@tamagui/animations-css";
import { tokens } from "./tokens";
import { themes } from "./themes";
import { bodyFont, headingFont } from "./fonts";

const animations = createAnimations({
  fast: "ease-in-out 150ms",
  medium: "ease-in-out 300ms",
  slow: "ease-in-out 500ms",
  bouncy: "cubic-bezier(0.34, 1.56, 0.64, 1) 400ms",
});

const config = createTamagui({
  animations,
  tokens,
  themes,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
  media: {
    xs: { maxWidth: 480 },
    sm: { maxWidth: 768 },
    md: { maxWidth: 1024 },
    lg: { maxWidth: 1280 },
    xl: { minWidth: 1281 },
    short: { maxHeight: 820 },
    tall: { minHeight: 821 },
    hoverable: { hover: "hover" },
    touchable: { pointer: "coarse" },
  },
  shorthands: {
    px: "paddingHorizontal",
    py: "paddingVertical",
    mx: "marginHorizontal",
    my: "marginVertical",
    f: "flex",
    w: "width",
    h: "height",
    bg: "backgroundColor",
    br: "borderRadius",
  } as const,
  settings: {
    allowedStyleValues: "somewhat-strict-web",
  },
});

export type AppConfig = typeof config;

declare module "tamagui" {
  // from tamagui docs - needed to merge types
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
