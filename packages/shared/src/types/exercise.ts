import z from "zod";
import {
  createExerciseSchema,
  exerciseQuerySchema,
  updateExerciseSchema,
} from "../schemas/exercise.schema";

export type CreateExerciseRequest = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseRequest = z.infer<typeof updateExerciseSchema>;

// z.infer is the schema's *output* — page/difficulty already coerced to numbers.
// (z.input would be the raw string shape that arrives on the query string.)
export type ExerciseQueryRequest = z.infer<typeof exerciseQuerySchema>;

export interface Exercise {
  id?: string;
  title: string;
  segments: TimeSignatureSegment[];
  originalSegments?: TimeSignatureSegment[]; // for reverting if created from xml
  fromXml: boolean;
  tags?: string[];
  difficulty?: number;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

export interface TimeSignatureSegment {
  measureCount: number;
  timeSigTop: number;
  timeSigBottom: number;
}
