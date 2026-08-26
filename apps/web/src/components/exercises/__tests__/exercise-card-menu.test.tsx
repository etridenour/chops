import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ExerciseCardMenu } from "../exercise-card-menu";

const onEdit = vi.fn();
const onDelete = vi.fn();

vi.mock(
  "@chops/ui",
  async () => (await import("@/test/chops-ui-mock")).mocks,
);

beforeEach(() => {
  onEdit.mockReset();
  onDelete.mockReset();
});

describe("ExerciseCardMenu", () => {
  test("clicking edit calls onEdit", async () => {
    const user = userEvent.setup();
    render(<ExerciseCardMenu onEdit={onEdit} onDelete={onDelete} />);

    await user.click(screen.getByText("Edit", { selector: "button" }));

    expect(onEdit).toHaveBeenCalled();
  });

  test("clicking delete opens ConfirmDialog", async () => {
    const user = userEvent.setup();
    render(<ExerciseCardMenu onEdit={onEdit} onDelete={onDelete} />);

    await user.click(screen.getByText("Delete", { selector: "button" }));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
  });

  test("clicking delete in ConfirmDialog calls onDelete", async () => {
    const user = userEvent.setup();
    render(<ExerciseCardMenu onEdit={onEdit} onDelete={onDelete} />);

    await user.click(screen.getByText("Delete", { selector: "button" })); // open the dialog
    await user.click(
      within(screen.getByRole("alertdialog")).getByText("Delete"),
    );
    expect(onDelete).toHaveBeenCalled();
  });
});
