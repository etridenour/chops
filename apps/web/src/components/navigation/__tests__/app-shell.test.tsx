import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { AppShell } from "../app-shell";

vi.mock(
  "@chops/ui",
  async () => (await import("@/test/chops-ui-mock")).mocks,
);

vi.mock("../sidebar", () => ({
  Sidebar: (): any => <div>Sidebar</div>,
}));

vi.mock("../mobile-header", () => ({
  MobileHeader: (): any => <div>MobileHeader</div>,
}));

vi.mock("@/components/auth/protected-route", () => ({
  ProtectedRoute: ({ children }: any): any => <div>{children}</div>,
}));

describe("App shell tests", () => {
  test("app shell renders children as expected", () => {
    render(
      <AppShell>
        <div>Page content</div>
      </AppShell>,
    );

    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  test("sidebar and mobileheader are present", () => {
    render(
      <AppShell>
        <div>Page content</div>
      </AppShell>,
    );
    expect(screen.getByText("MobileHeader")).toBeInTheDocument();
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });
});
