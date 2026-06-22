import { createExerciseSchema, updateExerciseSchema } from "../schemas/exercise.schema";
import {
  CreateExerciseRequest,
  UpdateExerciseRequest,
} from "../types/exercise";
import { extractErrors } from "./utils";

export function validateCreateExercise(input: CreateExerciseRequest): string[] {
  return extractErrors(createExerciseSchema.safeParse(input));
}

export function validateUpdateExercise(input: UpdateExerciseRequest): string[] {
  return extractErrors(updateExerciseSchema.safeParse(input));
}
