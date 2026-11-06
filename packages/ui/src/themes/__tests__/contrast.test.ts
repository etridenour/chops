import { describe, expect, test } from "vitest";
import { themes } from "../index";

const WCAG_AA_TEXT = 4.5;

const TEXT_ON_SURFACE = [
  ["color", "background"],
  ["color", "backgroundMuted"],
  ["color", "backgroundMutedHover"],
  ["colorMuted", "background"],
  ["colorMuted", "backgroundMuted"],
  ["colorMuted", "backgroundMutedHover"],
  ["colorSubtle", "background"],
  ["colorInverse", "backgroundStrong"],
  ["colorInverse", "backgroundStrongHover"],
] as const;

const CHECKED_THEMES = ["light", "dark"] as const;

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

function expandHex(hex: string) {
  return hex.length === 4
    ? `#${[...hex.slice(1)].map((c) => c + c).join("")}`
    : hex;
}

describe("theme text contrast meets WCAG AA", () => {
  for (const themeName of CHECKED_THEMES) {
    const theme = themes[themeName] as Record<string, string>;

    test.each(TEXT_ON_SURFACE)(
      `${themeName}: %s on %s`,
      (text, surface) => {
        const ratio = contrast(
          expandHex(theme[text]),
          expandHex(theme[surface]),
        );
        expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
      },
    );
  }
});
