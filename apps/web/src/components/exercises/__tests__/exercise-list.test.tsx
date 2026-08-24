import { Exercise } from "@chops/shared";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ExerciseList } from "../exercise-list";

// ─── MOCKS ─────────────────────────────────────────────

// The dim is a style, so the stand-in has to render it as one.
// YStack is overridden because the dimming behaviour is what's under test, and
// the real list container exposes it only as inline style. There is no role,
// label, or aria-busy to query — that gap is tracked in BACKLOG.
vi.mock("@chops/ui", async () => {
  const { mocks } = await import("@/test/chops-ui-mock");
  return {
    ...mocks,
    YStack: ({ children, opacity, pointerEvents }: any) => (
      <div data-testid="list" style={{ opacity, pointerEvents }}>
        {children}
      </div>
    ),
  };
});

// ExerciseCard has its own test. Here it only needs to prove it was rendered
// with the right exercise and that its callbacks are wired.
vi.mock("../exercise-card", () => ({
  ExerciseCard: ({ exercise, onEdit, onDelete }: any) => (
    <div>
      <span>{exercise.title}</span>
      <button onClick={onEdit}>edit {exercise.title}</button>
      <button onClick={onDelete}>delete {exercise.title}</button>
    </div>
  ),
}));

// ─── FIXTURES ──────────────────────────────────────────

const exercises: Exercise[] = [
  {
    id: "ex1",
    title: "Single Stroke Roll",
    segments: [{ measureCount: 4, timeSigTop: 4, timeSigBottom: 4 }],
    fromXml: false,
  },
  {
    id: "ex2",
    title: "Flam Accent",
    segments: [{ measureCount: 8, timeSigTop: 6, timeSigBottom: 8 }],
    fromXml: false,
  },
];

const onEdit = vi.fn();
const onDelete = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ExerciseList", () => {
  test("renders a card per exercise", () => {
    render(
      <ExerciseList
        exercises={exercises}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText("Single Stroke Roll")).toBeInTheDocument();
    expect(screen.getByText("Flam Accent")).toBeInTheDocument();
  });

  test("passes the exercise id back out of each card", async () => {
    const user = userEvent.setup();
    render(
      <ExerciseList
        exercises={exercises}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByRole("button", { name: "edit Flam Accent" }));
    expect(onEdit).toHaveBeenCalledWith("ex2");

    await user.click(
      screen.getByRole("button", { name: "delete Single Stroke Roll" }),
    );
    expect(onDelete).toHaveBeenCalledWith("ex1");
  });

  test("tells an empty library apart from empty filter results", () => {
    const { rerender } = render(
      <ExerciseList exercises={[]} onEdit={onEdit} onDelete={onDelete} />,
    );

    expect(screen.getByText("There are no exercises yet")).toBeInTheDocument();

    rerender(
      <ExerciseList
        exercises={[]}
        hasActiveFilters
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    // "Nothing here" and "nothing matched" are different problems for the user:
    // one means create something, the other means loosen the filters.
    expect(
      screen.getByText("No exercises match these filters"),
    ).toBeInTheDocument();
  });

  test("dims and stops accepting clicks while refetching", () => {
    const { rerender } = render(
      <ExerciseList
        exercises={exercises}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByTestId("list")).toHaveStyle({
      opacity: "1",
      pointerEvents: "auto",
    });

    rerender(
      <ExerciseList
        exercises={exercises}
        isFetching
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    // Blocking clicks matters as much as the dim: the rows on screen are about
    // to be replaced, so acting on one would act on stale data.
    expect(screen.getByTestId("list")).toHaveStyle({
      opacity: "0.5",
      pointerEvents: "none",
    });
  });
});
