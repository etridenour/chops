import { render, screen } from "./render";
import { Button } from "../components/Button";

describe("test setup smoke check", () => {
  it("renders a real Tamagui component inside the provider", () => {
    render(<Button>Smoke</Button>);
    expect(screen.getByText("Smoke")).toBeVisible();
  });
});
