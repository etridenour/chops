import { vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { render, screen } from "../../test/render";
import { ToggleGroup } from "../ToggleGroup";

const OPTIONS = ["easy", "medium", "hard"];

describe("ToggleGroup", () => {
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockReset();
  });

  it("renders one button per option", () => {
    render(
      <ToggleGroup options={OPTIONS} value={undefined} onChange={onChange} />,
    );

    expect(screen.getByRole("button", { name: "easy" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "medium" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "hard" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  // Guards a future refactor: if these ever become real DOM inputs, the option
  // would round-trip through `value` and come back as the string "8".
  it("passes the option back with its original type", () => {
    render(<ToggleGroup options={[2, 4, 8]} value={4} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "8" }));

    expect(onChange).toHaveBeenCalledWith(8);
  });

  it("calls onChange with the option when an unselected option is clicked", () => {
    render(<ToggleGroup options={OPTIONS} value="easy" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "hard" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("hard");
  });

  describe("when allowDeselect is off (the default)", () => {
    it("re-selects the option when the selected option is clicked", () => {
      render(
        <ToggleGroup options={OPTIONS} value="medium" onChange={onChange} />,
      );

      fireEvent.click(screen.getByRole("button", { name: "medium" }));

      expect(onChange).toHaveBeenCalledWith("medium");
    });
  });

  describe("when allowDeselect is on", () => {
    it("clears the value when the selected option is clicked", () => {
      render(
        <ToggleGroup
          options={OPTIONS}
          value="medium"
          onChange={onChange}
          allowDeselect
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: "medium" }));

      expect(onChange).toHaveBeenCalledWith(undefined);
    });

    it("still selects normally when an unselected option is clicked", () => {
      render(
        <ToggleGroup
          options={OPTIONS}
          value="medium"
          onChange={onChange}
          allowDeselect
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: "hard" }));

      expect(onChange).toHaveBeenCalledWith("hard");
    });
  });
});
