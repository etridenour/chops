import { describe, expect, test } from "vitest";
import { getTotalMeasures } from "../exercise.service";
import { TimeSignatureSegment } from "../../types";

describe("exercise.service.ts", () => {
  test("getTotalMeasures returns total measures", () => {
    const measures: TimeSignatureSegment[] = [
      { measureCount: 1, timeSigTop: 4, timeSigBottom: 4 },
      { measureCount: 2, timeSigTop: 3, timeSigBottom: 4 },
      { measureCount: 3, timeSigTop: 7, timeSigBottom: 8 },
      { measureCount: 4, timeSigTop: 6, timeSigBottom: 8 },
    ];

    const response = getTotalMeasures(measures);
    expect(response).toBe(10);
  });

  test("getTotalMeasures returns 0 if empty array", () => {
    const measures: TimeSignatureSegment[] = [];

    const response = getTotalMeasures(measures);
    expect(response).toBe(0);
  });
});
