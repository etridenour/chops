import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { Sidebar } from "../sidebar";
import userEvent from "@testing-library/user-event";

const mockLogout = vi.fn();
const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
}));

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
  Drum: () => <svg data-testid="nav-icon" />,
  H2: ({ children }: any) => <h2>{children}</h2>,
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
}));

beforeEach(() => {
  mockLogout.mockReset();
  mockUsePathname.mockReset();
});

describe("Sidebar component", () => {
  test("renders sidebar component elements", () => {
    mockUsePathname.mockReturnValue("/");

    render(<Sidebar />);

    expect(screen.getByText("Chops", { selector: "h2" })).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(
      screen.getByText("user@test.com", { selector: "span" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Log Out", { selector: "span" }),
    ).toBeInTheDocument();
  });

  test("calls logout function when log out button is clicked", async () => {
    mockUsePathname.mockReturnValue("/");
    const user = userEvent.setup();

    render(<Sidebar />);

    await user.click(screen.getByRole("button", { name: /Log Out/ }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
