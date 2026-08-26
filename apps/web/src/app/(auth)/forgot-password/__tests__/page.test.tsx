import { beforeEach, describe, expect, test, vi } from "vitest";
import ForgotPasswordPage from "../page";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock(
  "@chops/ui",
  async () => (await import("@/test/chops-ui-mock")).mocks,
);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("ForgotPasswordPage", () => {
  test("renders the forgot password form", () => {
    render(<ForgotPasswordPage />);

    expect(
      screen.getByText("Forgot Password", { selector: "h1" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByText("Send Reset Link", { selector: "button" }),
    ).toBeInTheDocument();
  });

  test("shows validation error for empty fields", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordPage />);

    await user.click(
      screen.getByText("Send Reset Link", { selector: "button" }),
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();

    expect(mockFetch).not.toHaveBeenCalled();
  });

  test("calls send reset link on valid submission", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const user = userEvent.setup();
    render(<ForgotPasswordPage />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.click(
      screen.getByText("Send Reset Link", { selector: "button" }),
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
  });

  test("shows confirmation screen on successful submission", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const user = userEvent.setup();
    render(<ForgotPasswordPage />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.click(
      screen.getByText("Send Reset Link", { selector: "button" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("The link expires in 5 minutes."),
      ).toBeInTheDocument();
    });
  });

  test("network error", async () => {
    mockFetch.mockRejectedValue(new Error("Invalid credentials"));

    const user = userEvent.setup();
    render(<ForgotPasswordPage />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.click(
      screen.getByText("Send Reset Link", { selector: "button" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  test("api error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });
    const user = userEvent.setup();
    render(<ForgotPasswordPage />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.click(
      screen.getByText("Send Reset Link", { selector: "button" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Request failed")).toBeInTheDocument();
    });
  });
});
