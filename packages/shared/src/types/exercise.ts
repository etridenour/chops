import z from "zod";
import { createExerciseSchema } from "../schemas/exercise.schema";

export type CreateExerciseRequest = z.infer<typeof createExerciseSchema>;

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
  orgIds?: string[];
}

export interface ExerciseMeasure {
  startingMeasure: number;
  measureCount: number;
  timeSigTop: number;
  timeSigBottom: number;
}
