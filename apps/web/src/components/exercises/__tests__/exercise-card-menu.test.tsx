import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ExerciseCardMenu } from "../exercise-card-menu";

const onEdit = vi.fn();
const onDelete = vi.fn();

vi.mock("@chops/ui", () => {
  const Popover: any = ({ children }: any) => <div>{children}</div>;
  Popover.Trigger = ({ children }: any) => <div>{children}</div>;
  Popover.Content = ({ children }: any) => <div>{children}</div>;
  Popover.Arrow = () => null;

  return {
    YStack: ({ children, ...props }: any) => (
      <div {...filterProps(props)}>{children}</div>
    ),
    Button: ({ children, onPress, loading }: any) => (
      <button
        onClick={onPress}
        disabled={loading}
        aria-busy={loading || undefined}
      >
        {children}
      </button>
    ),
    MoreVertical: () => <span>more-icon</span>,
    ConfirmDialog: ({
      open,
      onOpenChange,
      title,
      description,
      confirmLabel,
      cancelLabel,
      onConfirm,
    }: any) =>
      open ? (
        <div role="alertdialog">
          <h2>{title}</h2>
          <p>{description}</p>
          <button onClick={() => onOpenChange?.(false)}>
            {cancelLabel || "Cancel"}
          </button>
          <button onClick={onConfirm}>{confirmLabel || "Confirm"}</button>
        </div>
      ) : null,

    Popover,
  };
});

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
        "alignItems",
      ].includes(key)
    )
      continue;
    domSafe[key] = val;
  }
  return domSafe;
}

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
