import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import VerifyPage from "../page";
import { setAccessToken } from "@/lib/api-client";

const mockFetch = vi.fn();
global.fetch = mockFetch;
const mockTokenGet = vi.fn();
const validateCompleteSignup = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: mockTokenGet,
  }),
}));

vi.mock("@chops/shared", () => ({
  validateCompleteSignup,
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

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ login: vi.fn() }),
}));

vi.mock("@/lib/api-client", () => ({
  setAccessToken: vi.fn(),
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
        "alignItems",
      ].includes(key)
    )
      continue;
    domSafe[key] = val;
  }
  return domSafe;
}

beforeEach(() => {
  mockFetch.mockReset();
  mockTokenGet.mockReturnValue("validtoken");
  validateCompleteSignup.mockReset();
  Object.defineProperty(window, "location", {
    writable: true,
    value: { href: "" },
  });
});

describe("VerifyPage", () => {
  test("renders the verify page", () => {
    render(<VerifyPage />);

    expect(
      screen.getByText("Complete Your Account", { selector: "h1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Choose a display name and password to finish signing up.",
        { selector: "p" },
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Display Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();

    expect(
      screen.getByText("Create Account", { selector: "button" }),
    ).toBeInTheDocument();
  });

  test("no valid token", async () => {
    mockTokenGet.mockReturnValue(null);

    render(<VerifyPage />);

    expect(
      screen.getByText("Invalid Link", { selector: "h1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "This verification link is invalid or missing a token.",
        { selector: "p" },
      ),
    ).toBeInTheDocument();
  });

  test("fetch not called if complete signup validation fails", async () => {
    validateCompleteSignup.mockReturnValue(["Validation error"]);

    const user = userEvent.setup();
    render(<VerifyPage />);

    await user.type(screen.getByLabelText("Display Name"), "display-name");
    await user.type(screen.getByLabelText("Password"), "valid-password");
    await user.type(
      screen.getByLabelText("Confirm Password"),
      "invalid-password",
    );
    await user.click(
      screen.getByText("Create Account", { selector: "button" }),
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Validation error")).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test("shows confirmation screen on successful submission", async () => {
    validateCompleteSignup.mockReturnValue([]);
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ accessToken: "fake-token" }),
    });

    const user = userEvent.setup();
    render(<VerifyPage />);

    await user.type(screen.getByLabelText("Display Name"), "display-name");
    await user.type(screen.getByLabelText("Password"), "valid-password");
    await user.type(
      screen.getByLabelText("Confirm Password"),
      "valid-password",
    );
    await user.click(
      screen.getByText("Create Account", { selector: "button" }),
    );

    await waitFor(() => {
      expect(setAccessToken).toHaveBeenCalledWith("fake-token");
      expect(window.location.href).toBe("/");
    });
  });

  test("api error", async () => {
    validateCompleteSignup.mockReturnValue([]);
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });

    const user = userEvent.setup();
    render(<VerifyPage />);

    await user.type(screen.getByLabelText("Display Name"), "display-name");
    await user.type(screen.getByLabelText("Password"), "valid-password");
    await user.type(
      screen.getByLabelText("Confirm Password"),
      "valid-password",
    );
    await user.click(
      screen.getByText("Create Account", { selector: "button" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Verification failed")).toBeInTheDocument();
    });
  });

  test("network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    validateCompleteSignup.mockReturnValue([]);

    const user = userEvent.setup();
    render(<VerifyPage />);

    await user.type(screen.getByLabelText("Display Name"), "display-name");
    await user.type(screen.getByLabelText("Password"), "valid-password");
    await user.type(
      screen.getByLabelText("Confirm Password"),
      "valid-password",
    );
    await user.click(
      screen.getByText("Create Account", { selector: "button" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  test("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<VerifyPage />);

    const passwordInput = screen.getByLabelText("Password");

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByLabelText("Show password"));

    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByLabelText("Hide password"));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("toggles confirm password visibility", async () => {
    const user = userEvent.setup();
    render(<VerifyPage />);

    const passwordInput = screen.getByLabelText("Confirm Password");

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByLabelText("Show confirm password"));

    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByLabelText("Hide confirm password"));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("loading state", async () => {
    validateCompleteSignup.mockReturnValue([]);

    let resolveRequest: (value: any) => void;
    const pending = new Promise((resolve) => {
      resolveRequest = resolve;
    });
    mockFetch.mockReturnValue(pending);

    const user = userEvent.setup();
    render(<VerifyPage />);

    await user.type(screen.getByLabelText("Display Name"), "display-name");
    await user.type(screen.getByLabelText("Password"), "valid-password");
    await user.type(
      screen.getByLabelText("Confirm Password"),
      "valid-password",
    );
    await user.click(
      screen.getByText("Create Account", { selector: "button" }),
    );

    expect(
      screen.getByText("Create Account", { selector: "button" }),
    ).toBeDisabled();

    resolveRequest!({ ok: true, json: () => Promise.resolve({}) });
  });
});
