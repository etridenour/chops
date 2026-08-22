import { render, screen } from "../../test/render";
import { ErrorText } from "../Text";

describe("ErrorText", () => {
  it("is announced as an alert", () => {
    render(<ErrorText>Name is required</ErrorText>);

    expect(screen.getByRole("alert")).toHaveTextContent("Name is required");
  });

  it("declares an assertive live region for Android parity", () => {
    // role="alert" already implies assertive on web. React Native does not infer it, so the explicit aria-live is what reaches TalkBack.
    render(<ErrorText>Name is required</ErrorText>);

    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
  });
});
