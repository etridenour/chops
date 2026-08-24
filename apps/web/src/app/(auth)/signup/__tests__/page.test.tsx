import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import SignupPage from "../page";
import userEvent from "@testing-library/user-event";

const mockFetch = vi.fn();
global.fetch = mockFetch;
const validateStartSignup = vi.hoisted(() => vi.fn());

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

vi.mock("@chops/shared", () => ({
  validateStartSignup,
}));

beforeEach(() => {
  mockFetch.mockReset();
  validateStartSignup.mockReset();
});

describe("signupPage", () => {
  test("renders the signup page", () => {
    render(<SignupPage />);

    expect(screen.getByText("Sign Up", { selector: "h1" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByText("Send Verification Email", { selector: "button" }),
    ).toBeInTheDocument();
  });

  test("fetch not called if validate start signup fails", async () => {
    validateStartSignup.mockReturnValue(["Validation error"]);

    const user = userEvent.setup();
    render(<SignupPage />);

    await user.type(screen.getByLabelText("Email"), "invalid-email");
    await user.click(
      screen.getByText("Send Verification Email", { selector: "button" }),
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Validation error")).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test("shows confirmation screen on successful submission", async () => {
    validateStartSignup.mockReturnValue([]);
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const user = userEvent.setup();
    render(<SignupPage />);

    await user.type(screen.getByLabelText("Email"), "valid-email@email.123");
    await user.click(
      screen.getByText("Send Verification Email", { selector: "button" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Check your email", { selector: "h1" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("valid-email@email.123", {
          selector: "strong",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("The link expires in 1 hour.", { selector: "p" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Back to Log In", { selector: "span" }),
      ).toBeInTheDocument();
    });
  });

  test("api error", async () => {
    validateStartSignup.mockReturnValue([]);
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });

    const user = userEvent.setup();
    render(<SignupPage />);

    await user.type(screen.getByLabelText("Email"), "valid-email@email.123");
    await user.click(
      screen.getByText("Send Verification Email", { selector: "button" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Signup failed")).toBeInTheDocument();
    });
  });

  test("network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    validateStartSignup.mockReturnValue([]);

    const user = userEvent.setup();
    render(<SignupPage />);

    await user.type(screen.getByLabelText("Email"), "valid-email@email.123");
    await user.click(
      screen.getByText("Send Verification Email", { selector: "button" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  test("correct payload sent to fetch", async () => {
    validateStartSignup.mockReturnValue([]);
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    const user = userEvent.setup();
    render(<SignupPage />);

    await user.type(screen.getByLabelText("Email"), "valid-email@email.123");
    await user.click(
      screen.getByText("Send Verification Email", { selector: "button" }),
    );

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:4000/auth/signup/start",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "valid-email@email.123" }),
      },
    );
  });

  test("loading state", async () => {
    validateStartSignup.mockReturnValue([]);

    let resolveRequest: (value: any) => void;
    const pending = new Promise((resolve) => {
      resolveRequest = resolve;
    });
    mockFetch.mockReturnValue(pending);

    const user = userEvent.setup();
    render(<SignupPage />);

    await user.type(screen.getByLabelText("Email"), "valid-email@email.123");
    await user.click(
      screen.getByText("Send Verification Email", { selector: "button" }),
    );

    // The real Button never sets the DOM `disabled` attribute — it blocks the
    // press in JS and reports the state with aria-disabled, so the control
    // stays focusable. Asserting toBeDisabled() only ever passed against the
    // old stand-in.
    expect(
      screen.getByText("Send Verification Email", { selector: "button" }),
    ).toHaveAttribute("aria-disabled", "true");

    resolveRequest!({ ok: true, json: () => Promise.resolve({}) });
  });
});
