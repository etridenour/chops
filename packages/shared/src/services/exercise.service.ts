import { ExerciseMeasure } from "../types/exercise";

export function getTotalMeasures(measures: ExerciseMeasure[]): number {
  return measures.reduce((sum, m) => sum + m.measureCount, 0);
}
