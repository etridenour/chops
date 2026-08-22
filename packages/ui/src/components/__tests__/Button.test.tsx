import { vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { render, screen } from "../../test/render";
import { Button } from "../Button";

describe("Button", () => {
  const onPress = vi.fn();

  beforeEach(() => {
    onPress.mockReset();
  });

  describe("pressing", () => {
    it("calls onPress when clicked", () => {
      render(<Button onPress={onPress}>Save</Button>);

      fireEvent.click(screen.getByRole("button", { name: "Save" }));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("does not call onPress when disabled", () => {
      render(
        <Button onPress={onPress} disabled>
          Save
        </Button>,
      );

      fireEvent.click(screen.getByRole("button", { name: "Save" }));

      expect(onPress).not.toHaveBeenCalled();
    });

    it("does not call onPress when loading", () => {
      render(
        <Button onPress={onPress} loading>
          Save
        </Button>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(onPress).not.toHaveBeenCalled();
    });

    it("marks itself disabled to assistive tech", () => {
      render(<Button disabled>Save</Button>);

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    it("is not marked disabled when it is not", () => {
      render(<Button>Save</Button>);

      expect(screen.getByRole("button")).not.toHaveAttribute("aria-disabled");
    });
  });

  // On web the <button> element carries this role implicitly, so this assertion
  // looks redundant. It isn't: `render="button"` is dropped on native, where the
  // explicit role is the only thing making this a button to VoiceOver/TalkBack.
  // Nothing else in the suite would catch someone deleting it.
  it("carries an explicit button role for native", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("role", "button");
  });

  describe("loading", () => {
    it("shows the loading indicator when loading", () => {
      // The drum is a bare <svg> with no role, title, or label, so there is
      // nothing accessible to query. See the BACKLOG note above.
      const { container } = render(<Button loading>Save</Button>);

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("hides the children while loading", () => {
      render(<Button loading>Save</Button>);

      expect(screen.queryByText("Save")).not.toBeInTheDocument();
    });

    it("announces that it is busy while loading", () => {
      render(<Button loading>Save</Button>);

      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("keeps its accessible name while loading", () => {
      render(<Button loading>Save</Button>);

      // The visible label is gone (see above), so without an aria-label the
      // button would announce as nameless right when the user needs to know
      // which action is in flight.
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("is not marked busy when idle", () => {
      render(<Button>Save</Button>);

      expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
    });
  });

  describe("children", () => {
    it("renders a string child as text", () => {
      render(<Button>Save</Button>);

      expect(screen.getByText("Save")).toBeVisible();
    });

    it("renders a non-string child as given", () => {
      render(
        <Button>
          <img alt="drum icon" src="/drum.png" />
        </Button>,
      );

      expect(screen.getByRole("img", { name: "drum icon" })).toBeVisible();
    });
  });
});
