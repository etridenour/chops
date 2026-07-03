import { TimeSignatureSegment } from "../types/exercise";

export function getTotalMeasures(segment: TimeSignatureSegment[]): number {
  return segment.reduce((sum, s) => sum + s.measureCount, 0);
}
