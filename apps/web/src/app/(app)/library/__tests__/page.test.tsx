import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Exercises from "../page";

// ─── MOCKS ─────────────────────────────────────────────

const { mockPush } = vi.hoisted(() => ({ mockPush: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// The library does its own fetching and has its own test file. The page is
// just the frame around it.
vi.mock("@/components/exercises/exercise-library", () => ({
  ExerciseLibrary: () => <div>exercise library</div>,
}));

vi.mock("@chops/ui", () => ({
  YStack: ({ children }: any) => <div>{children}</div>,
  XStack: ({ children }: any) => <div>{children}</div>,
  H1: ({ children }: any) => <h1>{children}</h1>,
  Button: ({ children, onPress }: any) => (
    <button onClick={onPress}>{children}</button>
  ),
  Skeleton: () => <div data-testid="skeleton" />,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Library page", () => {
  test("renders the heading and the library", () => {
    render(<Exercises />);

    expect(
      screen.getByRole("heading", { name: "Library" }),
    ).toBeInTheDocument();
    expect(screen.getByText("exercise library")).toBeInTheDocument();
  });

  test("New Exercise goes to the create form", async () => {
    const user = userEvent.setup();
    render(<Exercises />);

    await user.click(screen.getByRole("button", { name: "New Exercise" }));

    expect(mockPush).toHaveBeenCalledWith("/library/new");
  });
});
