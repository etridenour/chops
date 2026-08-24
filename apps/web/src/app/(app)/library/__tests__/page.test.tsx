import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Exercises from "../page";

const { mockPush } = vi.hoisted(() => ({ mockPush: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/components/exercises/exercise-library", () => ({
  ExerciseLibrary: () => <div>exercise library</div>,
}));

vi.mock("@chops/ui", async () => (await import("@/test/chops-ui-mock")).mocks);

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
