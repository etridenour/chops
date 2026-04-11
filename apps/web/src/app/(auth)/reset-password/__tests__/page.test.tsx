import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import ResetPasswordPage from "../page";

const mockFetch = vi.fn();
global.fetch = mockFetch;
const mockTokenGet = vi.fn();
const validateResetPassword = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: mockTokenGet,
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@chops/ui", () => ({
  YStack: ({ children, ...props }: any) => (
    <div {...filterProps(props)}>{children}</div>
  ),
  Input: ({ id, value, onChange, error, ...props }: any) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      aria-invalid={error || undefined}
      {...filterProps(props)}
    />
  ),
  H1: ({ children }: any) => <h1>{children}</h1>,
  Button: ({ children, onPress, loading, ...props }: any) => (
    <button
      onClick={onPress}
      disabled={loading}
      aria-busy={loading || undefined}
    >
      {children}
    </button>
  ),
  Label: ({ children, htmlFor }: any) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
  ErrorText: ({ children, ...props }: any) => (
    <span role="alert">{children}</span>
  ),
  Body: ({ children }: any) => <p>{children}</p>,
  LinkText: ({ children }: any) => <span>{children}</span>,
  Eye: () => <span>eye-icon</span>,
  EyeOff: () => <span>eyeoff-icon</span>,
  XStack: ({ children, ...props }: any) => (
    <div {...filterProps(props)}>{children}</div>
  ),
  Spinner: () => <span>loading...</span>,
}));

function filterProps(props: Record<string, any>) {
  const domSafe: Record<string, any> = {};
  for (const [key, val] of Object.entries(props)) {
    // Skip Tamagui-specific props that aren't valid HTML attributes
    if (
      key.startsWith("$") ||
      [
        "inputMode",
        "autoCapitalize",
        "paddingRight",
        "fullWidth",
        "variant",
        "gap",
        "flex",
        "justifyContent",
        "marginHorizontal",
        "marginBottom",
        "marginTop",
        "textAlign",
        "maxWidth",
        "position",
      ].includes(key)
    )
      continue;
    domSafe[key] = val;
  }
  return domSafe;
}

vi.mock("@chops/shared", () => ({
  validateResetPassword,
}));

beforeEach(() => {
  mockFetch.mockReset();
  mockTokenGet.mockReturnValue("validtoken");
  validateResetPassword.mockReset();
});

describe("resetPasswordPage", () => {
  test("renders the reset password page", () => {
    render(<ResetPasswordPage />);

    expect(
      screen.getByText("Reset Your Password", { selector: "h1" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm New Password")).toBeInTheDocument();
    expect(
      screen.getByText("Reset Password", { selector: "button" }),
    ).toBeInTheDocument();
  });

  test("no valid token", async () => {
    mockTokenGet.mockReturnValue(null);

    render(<ResetPasswordPage />);

    expect(
      screen.getByText("Invalid Link", { selector: "h1" }),
    ).toBeInTheDocument();
  });

  test("shows confirmation screen on successful submission", async () => {
    validateResetPassword.mockReturnValue([]);
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const user = userEvent.setup();
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("New Password"), "valid-password");
    await user.type(
      screen.getByLabelText("Confirm New Password"),
      "valid-password",
    );
    await user.click(
      screen.getByText("Reset Password", { selector: "button" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Password Reset", { selector: "h1" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Your password has been reset successfully.", {
          selector: "p",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Log in with your new password", { selector: "span" }),
      ).toBeInTheDocument();
    });
  });

  test("api error", async () => {
    validateResetPassword.mockReturnValue([]);
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });

    const user = userEvent.setup();
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("New Password"), "valid-password");
    await user.type(
      screen.getByLabelText("Confirm New Password"),
      "valid-password",
    );
    await user.click(
      screen.getByText("Reset Password", { selector: "button" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Reset failed")).toBeInTheDocument();
    });
  });

  test("network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    validateResetPassword.mockReturnValue([]);

    const user = userEvent.setup();
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("New Password"), "valid-password");
    await user.type(
      screen.getByLabelText("Confirm New Password"),
      "valid-password",
    );
    await user.click(
      screen.getByText("Reset Password", { selector: "button" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  test("fetch not called if password validation fails", async () => {
    validateResetPassword.mockReturnValue(["Validation error"]);

    const user = userEvent.setup();
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("New Password"), "valid-password");
    await user.type(
      screen.getByLabelText("Confirm New Password"),
      "invalid-password",
    );
    await user.click(
      screen.getByText("Reset Password", { selector: "button" }),
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Validation error")).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("New Password");

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByLabelText("Show password"));

    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByLabelText("Hide password"));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("toggles confirm password visibility", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("Confirm New Password");

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByLabelText("Show confirm password"));

    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByLabelText("Hide confirm password"));
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
