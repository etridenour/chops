import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import ExerciseForm from "../exercise-form";

const { mockCreateExercise, mockUpdateExercise } = vi.hoisted(() => ({
  mockCreateExercise: vi.fn(),
  mockUpdateExercise: vi.fn(),
}));

vi.mock("@/lib/api/exercises", () => ({
  createExercise: mockCreateExercise, // key = real export, value = spy
  updateExercise: mockUpdateExercise,
}));

const onSuccess = vi.fn();
const onCancel = vi.fn();

vi.mock(
  "@chops/ui",
  async () => (await import("@/test/chops-ui-mock")).mocks,
);

const mockExercise = {
  id: "exId",
  title: "Test New Exercise",
  segments: [
    {
      measureCount: 4,
      timeSigTop: 4,
      timeSigBottom: 4,
    },
  ],
  tags: ["tag1", "tag2"],
  difficulty: 3,
  fromXml: false,
};

beforeEach(() => {
  onSuccess.mockReset();
  onCancel.mockReset();
  mockCreateExercise.mockReset();
  mockUpdateExercise.mockReset();
});

describe("ExerciseForm", () => {
  test("renders the form with all fields", () => {
    render(<ExerciseForm />);

    expect(
      screen.getByRole("heading", { name: "New Exercise" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByText("Time signatures")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("Difficulty")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  test("calls createExercise and onSuccess when form is submitted with valid data", async () => {
    const user = userEvent.setup();
    render(<ExerciseForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText("Title"), "Some Title");
    await user.click(screen.getByText("Create", { selector: "button" }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(mockCreateExercise).toHaveBeenCalledTimes(1);
    expect(mockCreateExercise).toHaveBeenCalledWith({
      title: "Some Title",
      segments: [{ measureCount: 8, timeSigTop: 4, timeSigBottom: 4 }],
      tags: [],
    });
  });

  test("calls updateExercise and onSuccess when form is submitted with valid data", async () => {
    const user = userEvent.setup();
    render(<ExerciseForm onSuccess={onSuccess} exercise={mockExercise} />);

    await user.click(screen.getByText("Save", { selector: "button" }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(mockUpdateExercise).toHaveBeenCalledTimes(1);
    expect(mockUpdateExercise).toHaveBeenCalledWith("exId", {
      title: "Test New Exercise",
      segments: [
        {
          measureCount: 4,
          timeSigTop: 4,
          timeSigBottom: 4,
        },
      ],
      tags: ["tag1", "tag2"],
      difficulty: 3,
    });
  });

  test("cancel button calls onCancel", async () => {
    const user = userEvent.setup();
    render(<ExerciseForm onCancel={onCancel} />);

    await user.click(screen.getByText("Cancel", { selector: "button" }));

    expect(onCancel).toHaveBeenCalled();
  });

  test("shows validation error and does not submit when title is empty", async () => {
    const user = userEvent.setup();
    render(<ExerciseForm />);

    await user.click(screen.getByText("Create", { selector: "button" }));

    expect(
      await screen.findByText("Exercise name is required"),
    ).toBeInTheDocument();
    expect(mockCreateExercise).not.toHaveBeenCalled();
  });

  test("displays error on API failure", async () => {
    mockCreateExercise.mockRejectedValue(
      new Error("Failed to create exercise"),
    );

    const user = userEvent.setup();
    render(<ExerciseForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText("Title"), "Some Title");
    await user.click(screen.getByText("Create", { selector: "button" }));

    expect(
      await screen.findByText("Failed to create exercise"),
    ).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  test("renders edit mode when an exercise is provided", () => {
    render(<ExerciseForm exercise={mockExercise} />);
    expect(
      screen.getByRole("heading", { name: "Edit Exercise" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
});
