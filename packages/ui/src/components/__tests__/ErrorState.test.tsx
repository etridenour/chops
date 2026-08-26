import { vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { render, screen } from "../../test/render";
import { ErrorState } from "../ErrorState";

describe("ErrorState", () => {
  const onRetry = vi.fn();

  beforeEach(() => {
    onRetry.mockReset();
  });

  describe("announcing", () => {
    it("announces the failure as an alert", () => {
      render(<ErrorState message="Failed to load exercises" />);

      expect(screen.getByRole("alert")).toHaveTextContent(
        "Failed to load exercises",
      );
    });

    it("declares an assertive live region for Android parity", () => {
      render(<ErrorState message="Failed to load exercises" />);

      expect(screen.getByRole("alert")).toHaveAttribute(
        "aria-live",
        "assertive",
      );
    });

    it("includes the retry button in the announcement", () => {
      // The region wraps the whole block on purpose: hearing the error without
      // hearing that a retry exists leaves the user stuck.
      render(<ErrorState message="Failed to load" onRetry={onRetry} />);

      expect(screen.getByRole("alert")).toHaveTextContent("Try again");
    });
  });

  describe("title", () => {
    it("falls back to a generic title", () => {
      render(<ErrorState message="Failed to load" />);

      expect(
        screen.getByRole("heading", { name: "Something went wrong" }),
      ).toBeInTheDocument();
    });

    it("uses the given title instead", () => {
      render(<ErrorState message="Failed to load" title="No connection" />);

      expect(
        screen.getByRole("heading", { name: "No connection" }),
      ).toBeInTheDocument();
      expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
    });
  });

  describe("retrying", () => {
    it("calls onRetry when the retry button is clicked", () => {
      render(<ErrorState message="Failed to load" onRetry={onRetry} />);

      fireEvent.click(screen.getByRole("button", { name: "Try again" }));

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("renders no retry button when there is nothing to retry", () => {
      render(<ErrorState message="Failed to load" />);

      expect(screen.queryByRole("button")).toBeNull();
    });
  });
});
