import { Exercise } from "@chops/shared";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ExerciseCard } from "../exercise-card";

vi.mock("@chops/ui", async () => (await import("@/test/chops-ui-mock")).mocks);

// The menu has its own test. This stub only needs to be a click target that
// sits inside the card.
vi.mock("../exercise-card-menu", () => ({
  ExerciseCardMenu: ({ onEdit, onDelete }: any) => (
    <div>
      <button onClick={onEdit}>menu edit</button>
      <button onClick={onDelete}>menu delete</button>
    </div>
  ),
}));

const exercise: Exercise = {
  id: "ex1",
  title: "Flam Accent",
  segments: [
    { measureCount: 4, timeSigTop: 4, timeSigBottom: 4 },
    { measureCount: 8, timeSigTop: 6, timeSigBottom: 8 },
  ],
  tags: ["flams", "rudiments", "warmup", "hard"],
  difficulty: 3,
  fromXml: false,
};

const onEdit = vi.fn();
const onDelete = vi.fn();

function renderCard(overrides: Partial<Exercise> = {}) {
  return render(
    <ExerciseCard
      exercise={{ ...exercise, ...overrides }}
      onEdit={onEdit}
      onDelete={onDelete}
    />,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ExerciseCard", () => {
  test("sums the measures and lists every time signature", () => {
    renderCard();

    expect(screen.getByText("Flam Accent")).toBeInTheDocument();
    expect(
      screen.getByText("12 measures · 4/4 → 6/8 · Difficulty 3"),
    ).toBeInTheDocument();
  });

  test("leaves difficulty out when the exercise has none", () => {
    renderCard({ difficulty: undefined });

    expect(screen.getByText("12 measures · 4/4 → 6/8")).toBeInTheDocument();
  });

  test("shows three tags and collapses the rest into a count", () => {
    renderCard();

    expect(screen.getByText("flams")).toBeInTheDocument();
    expect(screen.getByText("rudiments")).toBeInTheDocument();
    expect(screen.getByText("warmup")).toBeInTheDocument();
    expect(screen.queryByText("hard")).not.toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  test("clicking anywhere on the card edits it", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByText("12 measures · 4/4 → 6/8 · Difficulty 3"));

    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  test("the title is the button that edits it", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole("button", { name: "Flam Accent" }));

    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  test("Enter and Space on the focused title edit it too", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.tab();
    expect(screen.getByRole("button", { name: "Flam Accent" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onEdit).toHaveBeenCalledTimes(2);
  });

  test("the menu is not nested inside another button", () => {
    renderCard();

    const menuButton = screen.getByRole("button", { name: "menu edit" });

    expect(menuButton.parentElement?.closest("button")).toBeNull();
  });

  test("deleting from the menu does not also open the editor", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole("button", { name: "menu delete" }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onEdit).not.toHaveBeenCalled();
  });
});
