import { vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { render, screen } from "../../test/render";
import { ToggleGroupMulti } from "../ToggleGroupMulti";

const OPTIONS = ["snare", "tenor", "bass"];

describe("ToggleGroupMulti", () => {
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockReset();
  });

  it("renders one button per option", () => {
    render(
      <ToggleGroupMulti options={OPTIONS} value={[]} onChange={onChange} />,
    );

    expect(screen.getByRole("button", { name: "snare" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "tenor" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "bass" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("marks every selected option as pressed", () => {
    render(
      <ToggleGroupMulti
        options={OPTIONS}
        value={["snare", "bass"]}
        onChange={onChange}
      />,
    );

    const pressed = screen
      .getAllByRole("button", { pressed: true })
      .map((b) => b.textContent);

    expect(pressed).toEqual(["snare", "bass"]);
    expect(screen.getByRole("button", { pressed: false })).toHaveTextContent(
      "tenor",
    );
  });

  it("marks every option as not pressed when the value is empty", () => {
    render(
      <ToggleGroupMulti options={OPTIONS} value={[]} onChange={onChange} />,
    );

    expect(screen.queryByRole("button", { pressed: true })).toBeNull();
    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(3);
  });

  it("appends the option when an unselected option is clicked", () => {
    render(
      <ToggleGroupMulti
        options={OPTIONS}
        value={["snare"]}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "bass" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(["snare", "bass"]);
  });

  it("removes the option when an already-selected option is clicked", () => {
    render(
      <ToggleGroupMulti
        options={OPTIONS}
        value={["snare", "tenor", "bass"]}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "tenor" }));

    expect(onChange).toHaveBeenCalledWith(["snare", "bass"]);
  });

  it("passes an empty array when the last selected option is removed", () => {
    render(
      <ToggleGroupMulti
        options={OPTIONS}
        value={["tenor"]}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "tenor" }));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("does not mutate the array it was given", () => {
    const value = ["snare"];

    render(
      <ToggleGroupMulti options={OPTIONS} value={value} onChange={onChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "bass" }));

    expect(value).toEqual(["snare"]);
    expect(onChange.mock.calls[0][0]).not.toBe(value);
  });
});
