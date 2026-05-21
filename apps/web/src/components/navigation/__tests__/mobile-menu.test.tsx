import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MobileMenu } from "../mobile-menu";

const mockOnOpenChange = vi.fn();
const mockLogout = vi.fn();
const { mockUsePathname, MockSheet } = vi.hoisted(() => {
  const MockSheet = ({ children }: any) => <div>{children}</div>;
  MockSheet.Overlay = () => <div />;
  MockSheet.Handle = () => <div />;
  MockSheet.Frame = ({ children }: any) => <div>{children}</div>;

  return {
    mockUsePathname: vi.fn(),
    MockSheet,
  };
});

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    logout: mockLogout,
    user: { email: "user@test.com" },
  }),
}));

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
  Button: ({ children, onPress, loading, ...props }: any) => (
    <button
      onClick={onPress}
      disabled={loading}
      aria-busy={loading || undefined}
    >
      {children}
    </button>
  ),
  Separator: () => <hr />,
  LogOut: () => <svg data-testid="logout-icon" />,
  Sheet: MockSheet,
}));

beforeEach(() => {
  mockLogout.mockReset();
  mockUsePathname.mockReset();
  mockOnOpenChange.mockReset();
});

describe("MobileMenu component", () => {
  test("renders mobile menu component elements", () => {
    mockUsePathname.mockReturnValue("/");

    render(<MobileMenu open={true} onOpenChange={mockOnOpenChange} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(
      screen.getByText("user@test.com", { selector: "span" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Log Out", { selector: "span" }),
    ).toBeInTheDocument();
  });

  test("clicking a nav link calls onOpenChange(false)", async () => {
    mockUsePathname.mockReturnValue("/");
    const user = userEvent.setup();

    render(<MobileMenu open={true} onOpenChange={mockOnOpenChange} />);

    await user.click(screen.getByRole("link", { name: /Home/ }));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  test("calls logout function when log out button is clicked", async () => {
    mockUsePathname.mockReturnValue("/");
    const user = userEvent.setup();

    render(<MobileMenu open={true} onOpenChange={mockOnOpenChange} />);

    await user.click(screen.getByRole("button", { name: /Log Out/ }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
