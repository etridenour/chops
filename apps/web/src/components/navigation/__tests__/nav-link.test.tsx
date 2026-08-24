import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { NavLink } from "../nav-link";
import userEvent from "@testing-library/user-event";

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
}));
const mockOnPress = vi.fn();
const MockIcon = () => <svg data-testid="nav-icon" />;

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

vi.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));

// XStack is overridden here because the active-state styling is the thing under
// test, and the real component exposes it only as a background colour.
vi.mock("@chops/ui", async () => {
  const { mocks } = await import("@/test/chops-ui-mock");
  return {
    ...mocks,
    XStack: ({ children, backgroundColor }: any) => (
      <div data-testid="nav-link-container" data-background={backgroundColor}>
        {children}
      </div>
    ),
  };
});

beforeEach(() => {
  mockUsePathname.mockReset();
  mockOnPress.mockReset();
});

describe("NavLink component", () => {
  test("renders the navlink properly", () => {
    mockUsePathname.mockReturnValue("/");

    render(<NavLink href="/" label="Navlink label" icon={MockIcon} />);

    expect(screen.getByText("Navlink label")).toBeInTheDocument();
    expect(screen.getByTestId("nav-icon")).toBeInTheDocument();
  });

  test("navlink href is passed correctly", () => {
    mockUsePathname.mockReturnValue("/");

    render(<NavLink href="/test-href" label="Navlink label" icon={MockIcon} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/test-href");
  });

  test("clicking link calls link handler", async () => {
    mockUsePathname.mockReturnValue("/");
    const user = userEvent.setup();

    render(
      <NavLink
        href="/test-href"
        label="Navlink label"
        icon={MockIcon}
        onPress={mockOnPress}
      />,
    );

    await user.click(screen.getByRole("link"));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test("active state is applied correctly", () => {
    mockUsePathname.mockReturnValue("/active-href");

    render(
      <NavLink href="/active-href" label="Navlink label" icon={MockIcon} />,
    );

    expect(screen.getAllByTestId("nav-link-container")[0]).toHaveAttribute(
      "data-background",
      "$backgroundMuted",
    );
  });

  test("inactive state is applied correctly", () => {
    mockUsePathname.mockReturnValue("/active-href");

    render(
      <NavLink href="/inactive-href" label="Navlink label" icon={MockIcon} />,
    );

    expect(screen.getAllByTestId("nav-link-container")[0]).toHaveAttribute(
      "data-background",
      "transparent",
    );
  });
});
