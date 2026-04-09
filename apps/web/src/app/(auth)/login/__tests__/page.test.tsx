/**
 * Component tests for LoginPage.
 *
 * WHAT THIS FILE DOES:
 * Tests the LoginPage component by rendering it in a fake browser (happy-dom),
 * simulating user interactions, and checking the results.
 *
 * KEY DIFFERENCE FROM UNIT TESTS:
 * Unit tests call a function and check the return value.
 * Component tests render a component, interact with it like a user would,
 * and check what appears on screen.
 *
 * MOCKING:
 * LoginPage depends on useAuth (for the login function) and next/link
 * (for navigation). We don't want our tests to actually call the API
 * or navigate — we just want to verify that LoginPage calls login()
 * with the right arguments. So we "mock" those dependencies:
 * we replace them with fake versions we control.
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../page";

// ─── MOCKS ─────────────────────────────────────────────
// vi.mock() replaces an entire module with a fake version.
// This runs BEFORE the component imports the module.

// Create a mock login function we can inspect later.
// vi.fn() creates a "spy" — a fake function that records every call made to it.
// We can later check: was it called? With what arguments? How many times?
const mockLogin = vi.fn();

// Mock the useAuth hook so it returns our fake login function
// instead of the real one that would call the API.
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    isLoading: false,
  }),
}));

// Mock next/link so it renders a plain <a> tag instead of
// trying to use Next.js router (which doesn't exist in tests).
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock Tamagui components to simple HTML elements.
// Tamagui needs a theme provider, native CSS, etc. that don't exist
// in our test environment. Mocking them avoids setup complexity and
// keeps our tests focused on LoginPage's logic, not Tamagui's rendering.
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
}));

// Helper: filter out non-DOM props that React would warn about
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

// ─── TESTS ─────────────────────────────────────────────

// beforeEach() runs before EVERY test in all describe blocks in this file.
// We reset the mock so that calls from one test don't leak into another.
// This is critical — tests should be independent of each other.
beforeEach(() => {
  mockLogin.mockReset();
});

describe("LoginPage", () => {
  // Test 1: Does the page render at all?
  // This is the most basic "smoke test" — if this fails,
  // everything else will too.
  test("renders the login form", () => {
    render(<LoginPage />);

    // screen.getByText() finds an element by its visible text content.
    // If it can't find it, the test fails with a helpful error message.
    expect(screen.getByText("Log In", { selector: "h1" })).toBeInTheDocument();

    // getByLabelText() finds a DOM element by its associated <label>.
    // This is the PREFERRED way to query form fields — it also
    // verifies your labels are properly connected (good for accessibility).
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  // Test 2: Validation errors — what happens when the user submits bad data?
  // This tests the branching logic at lines 33-38 of page.tsx.
  test("shows validation error for empty fields", async () => {
    // userEvent.setup() creates a user simulation instance.
    // Always call this BEFORE render().
    const user = userEvent.setup();
    render(<LoginPage />);

    // Click the submit button without typing anything
    await user.click(screen.getByText("Log In", { selector: "button" }));

    // After clicking, a validation error should appear.
    // getByRole("alert") finds elements with role="alert" — our ErrorText component.
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Crucially: login should NOT have been called.
    // The whole point of client-side validation is to prevent bad API calls.
    expect(mockLogin).not.toHaveBeenCalled();
  });

  // Test 3: Successful submission — valid data reaches the login function.
  test("calls login with email and password on valid submission", async () => {
    // Make the mock login resolve successfully (no error thrown)
    mockLogin.mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<LoginPage />);

    // Type into the fields. userEvent.type() simulates real keystrokes —
    // focus, keydown, input, keyup for each character.
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "mypassword123");

    // Submit the form
    await user.click(screen.getByText("Log In", { selector: "button" }));

    // Assert: login was called exactly once, with the right arguments.
    // This is the core of what we're testing — that the component
    // correctly passes user input to the login function.
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "mypassword123");
  });

  // Test 4: Error handling — what happens when login fails?
  // This tests the catch block at lines 43-44 of page.tsx.
  test("displays error message when login fails", async () => {
    // Make the mock throw an error, simulating an API failure
    mockLogin.mockRejectedValue(new Error("Invalid credentials"));

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "wrongpassword");
    await user.click(screen.getByText("Log In", { selector: "button" }));

    // waitFor() retries the assertion until it passes or times out.
    // We need this because the error appears AFTER an async operation
    // (the login promise rejecting). Without waitFor, we'd check
    // the DOM before React has re-rendered with the error.
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Invalid credentials",
      );
    });
  });

  // Test 5: Validation error for invalid email — tests the emailInvalid
  // state (line 36 of page.tsx) which highlights the email input.
  test("shows validation error and marks email invalid for bad email format", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Password"), "somepassword");
    await user.click(screen.getByText("Log In", { selector: "button" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Email is not valid");
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid");
    expect(mockLogin).not.toHaveBeenCalled();
  });

  // Test 6: Generic API error — when the error has no specific message,
  // the component still displays whatever err.message contains.
  test("displays generic error message on unexpected API failure", async () => {
    mockLogin.mockRejectedValue(new Error("Login failed"));

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "mypassword123");
    await user.click(screen.getByText("Log In", { selector: "button" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Login failed");
    });
  });

  // Test 7: Error clears when user starts typing — tests the onChange
  // handlers at lines 70-71 of page.tsx.
  test("clears error when user starts typing", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    // Trigger a validation error
    await user.click(screen.getByText("Log In", { selector: "button" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Type in the email field — error should disappear
    await user.type(screen.getByLabelText("Email"), "a");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  // Test 8: Password visibility toggle
  test("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText("Password");

    // Initially the password should be hidden
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click the toggle button (found by its aria-label)
    await user.click(screen.getByLabelText("Show password"));

    // Now it should be visible
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click again to hide
    await user.click(screen.getByLabelText("Hide password"));
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
