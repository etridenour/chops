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

    // BACKLOG: `disabled` never reaches the DOM — the <button> has no `disabled`
    // or `aria-disabled` attribute, only opacity 0.5. It stays focusable and is
    // announced as an ordinary enabled button. Write this once that's fixed.
    it.todo("exposes its disabled state to assistive tech");
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
