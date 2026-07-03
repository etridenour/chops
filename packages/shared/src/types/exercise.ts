import z from "zod";
import {
  createExerciseSchema,
  updateExerciseSchema,
} from "../schemas/exercise.schema";

export type CreateExerciseRequest = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseRequest = z.infer<typeof updateExerciseSchema>;

export interface Exercise {
  id?: string;
  title: string;
  timeSigChangeMeasures: ExerciseMeasure[];
  originalTimeSigChangeMeasures?: ExerciseMeasure[]; // for reverting if created from xml
  fromXml: boolean;
  tags?: string[];
  difficulty?: number;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

export interface ExerciseMeasure {
  measureCount: number;
  timeSigTop: number;
  timeSigBottom: number;
}
