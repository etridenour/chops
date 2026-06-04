import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { NavItems } from "../nav-items";
import userEvent from "@testing-library/user-event";

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
}));
const mockOnNavigate = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    onClick,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));

vi.mock("@chops/ui", () => ({
  YStack: ({ children }: any) => (
    <div data-testid="nav-items-container">{children}</div>
  ),
  XStack: ({ children }: any) => <div>{children}</div>,
  Home: () => <svg data-testid="nav-icon" />,
  Body: ({ children }: any) => <span>{children}</span>,
}));

beforeEach(() => {
  mockUsePathname.mockReset();
  mockOnNavigate.mockReset();
});

describe("NavItems component", () => {
  test("renders nav items correctly", () => {
    mockUsePathname.mockReturnValue("/");

    render(<NavItems />);

    expect(screen.getByTestId("nav-items-container")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("calls onNavigate when a nav item is clicked", async () => {
    mockUsePathname.mockReturnValue("/");
    const user = userEvent.setup();

    render(<NavItems onNavigate={mockOnNavigate} />);

    await user.click(screen.getByRole("link"));

    expect(mockOnNavigate).toHaveBeenCalledTimes(1);
  });

  test("home link has correct href", () => {
    mockUsePathname.mockReturnValue("/");

    render(<NavItems />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });
});
