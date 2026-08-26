import { describe, expect, test } from "vitest";
import { buildExerciseWhere } from "../exercise.service";

describe("buildExerciseWhere", () => {
  test("search becomes a case-insensitive title filter", () => {
    const where = buildExerciseWhere("user_1", { search: "test" });
    expect(where).toEqual({
      userId: "user_1",
      title: { contains: "test", mode: "insensitive" },
    });
  });

  test("tags become a hasSome filter", () => {
    const where = buildExerciseWhere("user_1", { tags: ["test"] });
    expect(where).toEqual({ userId: "user_1", tags: { hasSome: ["test"] } });
  });

  test("difficulty becomes an in filter", () => {
    const where = buildExerciseWhere("user_1", { difficulty: [2, 3] });
    expect(where).toEqual({ userId: "user_1", difficulty: { in: [2, 3] } });
  });

  test("no filters only returns userId", () => {
    const where = buildExerciseWhere("user_1", {});
    expect(where).toEqual({ userId: "user_1" });
  });

  test.each([
    ["search", { search: "" }],
    ["tags", { tags: [] }],
    ["difficulty", { difficulty: [] }],
  ])("omits %s when empty", (_label, filters) => {
    expect(buildExerciseWhere("user_1", filters)).toEqual({ userId: "user_1" });
  });
});
