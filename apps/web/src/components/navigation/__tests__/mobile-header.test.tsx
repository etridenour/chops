import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { MobileHeader } from "../mobile-header";
import userEvent from "@testing-library/user-event";

vi.mock("@chops/ui", () => ({
  XStack: ({ children }: any) => <div>{children}</div>,
  H2: ({ children }: any) => <h2>{children}</h2>,
  Button: ({ children, onPress, loading, ...props }: any) => (
    <button
      onClick={onPress}
      disabled={loading}
      aria-busy={loading || undefined}
    >
      {children}
    </button>
  ),
  Menu: () => <svg data-testid="menu-icon" />,
  X: () => <svg data-testid="x-icon" />,
}));

vi.mock("../mobile-menu", () => ({
  MobileMenu: ({ open }: any) => (
    <div data-testid="mobile-menu" data-open={open} />
  ),
}));

describe("Mobile header component", () => {
  test("renders mobile header items correctly", () => {
    render(<MobileHeader />);

    expect(screen.getByText("Chops", { selector: "h2" })).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("clicking the button opens the menu and swaps the icon", async () => {
    const user = userEvent.setup();
    render(<MobileHeader />);

    expect(screen.queryByTestId("menu-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("mobile-menu")).toHaveAttribute(
      "data-open",
      "false",
    );

    await user.click(screen.getByRole("button"));

    expect(screen.queryByTestId("x-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("menu-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("mobile-menu")).toHaveAttribute(
      "data-open",
      "true",
    );
  });
});
