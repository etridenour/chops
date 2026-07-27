import { describe, expect, test } from "vitest";
import {
  parseExerciseQuery,
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

    expect(errors[0].toLowerCase()).toContain("segment");
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

describe("parseExerciseQuery", () => {
  test("defaults give page 1 and pagesize 20 if {} is provided", () => {
    const response = parseExerciseQuery({});

    expect(response).toEqual({ ok: true, data: { page: 1, pageSize: 20 } });
  });

  test.each([
    ["pageSize above max", { pageSize: "101" }],
    ["page below min", { page: "0" }],
    ["search over 100 chars", { search: "a".repeat(101) }],
    ["difficulty above 5", { difficulty: "6" }],
  ])("rejects %s", (_label, input) => {
    expect(parseExerciseQuery(input)).toEqual({
      ok: false,
      errors: expect.arrayContaining([expect.any(String)]),
    });
  });

  test.each([
    ["splits on commas", "flam,drag", ["flam", "drag"]],
    ["trims whitespace", "flam, drag ", ["flam", "drag"]],
    ["drops blank entries", "flam,,drag", ["flam", "drag"]],
    ["empty string gives empty array", "", []],
  ])("tags %s", (_label, input, expected) => {
    expect(parseExerciseQuery({ tags: input })).toEqual({
      ok: true,
      data: expect.objectContaining({ tags: expected }),
    });
  });

  test("empty search stays empty", () => {
    expect(parseExerciseQuery({ search: "" })).toEqual({
      ok: true,
      data: expect.objectContaining({ search: "" }),
    });
  });

  test('difficulty "1,2,3" becomes [1,2,3]', () => {
    expect(parseExerciseQuery({ difficulty: "1,2,3" })).toEqual({
      ok: true,
      data: expect.objectContaining({ difficulty: [1, 2, 3] }),
    });
  });
});
