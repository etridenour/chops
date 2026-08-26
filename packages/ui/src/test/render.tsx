import {
  render as rtlRender,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";

function Providers({ children }: { children: ReactNode }) {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      {children}
    </TamaguiProvider>
  );
}

export function render(ui: ReactElement, options?: RenderOptions): RenderResult {
  return rtlRender(ui, { wrapper: Providers, ...options });
}

export * from "@testing-library/react";
export { render as rtlRender } from "@testing-library/react";
