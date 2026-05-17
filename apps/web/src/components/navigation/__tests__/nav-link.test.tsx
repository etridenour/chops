import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { NavLink } from "../nav-link";

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
}));
const MockIcon = () => <svg data-testid="nav-icon" />;

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));

vi.mock("@chops/ui", () => ({
  XStack: ({ children }: any) => <div>{children}</div>,
}));

beforeEach(() => {
  mockUsePathname.mockReset();
});

describe("NavLink component", () => {
  test("renders the navlink properly", () => {
    mockUsePathname.mockReturnValue("/");

    render(<NavLink href="/" label="Navlink label" icon={MockIcon} />);

    expect(screen.getByText("Navlink label")).toBeInTheDocument();
    expect(screen.getByTestId("nav-icon")).toBeInTheDocument();
  });
});
