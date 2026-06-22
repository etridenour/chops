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
  totalMeasures: number;
  timeSigChangeMeasures: ExerciseMeasure[];
  originalTimeSigChangeMeasures?: ExerciseMeasure[]; // this is so the user can revert if created from xml
  fromXml: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

export interface ExerciseMeasure {
  startingMeasure: number;
  measureCount: number;
  timeSigTop: number;
  timeSigBottom: number;
}
