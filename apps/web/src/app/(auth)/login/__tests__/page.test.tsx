import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../page";

const mockLogin = vi.fn();

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    isLoading: false,
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

vi.mock("@chops/ui", async () => (await import("@/test/chops-ui-mock")).mocks);

beforeEach(() => {
  mockLogin.mockReset();
});

describe("LoginPage", () => {
  test("renders the login form", () => {
    render(<LoginPage />);

    expect(screen.getByText("Log In", { selector: "h1" })).toBeInTheDocument();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  test("shows validation error for empty fields", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByText("Log In", { selector: "button" }));

    expect(screen.getByRole("alert")).toBeInTheDocument();

    expect(mockLogin).not.toHaveBeenCalled();
  });

  test("calls login with email and password on valid submission", async () => {
    mockLogin.mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "mypassword123");

    await user.click(screen.getByText("Log In", { selector: "button" }));

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "mypassword123");
  });

  test("displays error message when login fails", async () => {
    mockLogin.mockRejectedValue(new Error("Invalid credentials"));

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "wrongpassword");
    await user.click(screen.getByText("Log In", { selector: "button" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Invalid credentials",
      );
    });
  });

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

  test("clears error when user starts typing", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByText("Log In", { selector: "button" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Email"), "a");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText("Password");

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByLabelText("Show password"));

    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByLabelText("Hide password"));
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
