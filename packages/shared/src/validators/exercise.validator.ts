import {
  createExerciseSchema,
  exerciseQuerySchema,
  updateExerciseSchema,
} from "../schemas/exercise.schema";
import {
  CreateExerciseRequest,
  ExerciseQueryRequest,
  UpdateExerciseRequest,
} from "../types/exercise";
import { extractErrors } from "./utils";

export function validateCreateExercise(input: CreateExerciseRequest): string[] {
  return extractErrors(createExerciseSchema.safeParse(input));
}

export function validateUpdateExercise(input: UpdateExerciseRequest): string[] {
  return extractErrors(updateExerciseSchema.safeParse(input));
}

// Unlike the validate* helpers, query params need the *parsed* result back —
// "2" has become 2, "a,b" has become ["a","b"]. Hence data rather than just errors.
export function parseExerciseQuery(
  input: unknown,
):
  | { ok: true; data: ExerciseQueryRequest }
  | { ok: false; errors: string[] } {
  const result = exerciseQuerySchema.safeParse(input);

  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, errors: extractErrors(result) };
}
