import { describe, expect, test } from "vitest";
import {
  validateCreateExercise,
  validateUpdateExercise,
} from "../exercise.validator";

const mockExercise = {
  title: "title",
  segments: [
    {
      measureCount: 8,
      timeSigTop: 4,
      timeSigBottom: 4,
    },
  ],
  fromXml: false,
};

describe("validate exercise", () => {
  test("returns empty array for valid exercise", () => {
    const errors = validateCreateExercise(mockExercise);

    expect(errors).toEqual([]);
  });

  test("returns error if no title", () => {
    const errors = validateCreateExercise({ ...mockExercise, title: "" });

    expect(errors[0].toLowerCase()).toContain("exercise");
  });

  test("returns error if no timeSigMeasure", () => {
    const errors = validateCreateExercise({
      ...mockExercise,
      segments: [],
    });

    expect(errors[0].toLowerCase()).toContain("measure");
  });

  test("returns error if invalid timeSigBottom", () => {
    const errors = validateCreateExercise({
      ...mockExercise,
      segments: [{ ...mockExercise.segments[0], timeSigBottom: 3 }],
    });

    expect(errors[0].toLowerCase()).toContain("must be");
  });

  test("returns no error if valid update exercise partial", () => {
    const { title, ...partialExercise } = mockExercise;
    const errors = validateUpdateExercise(partialExercise);

    expect(errors).toEqual([]);
  });

  test("returns no error if valid update exercise empty object", () => {
    const errors = validateUpdateExercise({});

    expect(errors).toEqual([]);
  });
});
