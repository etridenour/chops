import z from "zod";

const exerciseMeasureSchema = z.object({
  startingMeasure: z.number(),
  measureCount: z.number(),
  timeSigTop: z.number().min(1).max(16),
  timeSigBottom: z
    .number()
    .refine((v) => [4, 8, 16, 32].includes(v), "Must be 4, 8, 16, or 32"),
});

export const createExerciseSchema = z.object({
  title: z.string().min(1, "Exercise name is required"),
  totalMeasures: z.number().min(1),
  timeSigChangeMeasures: z
    .array(exerciseMeasureSchema)
    .min(1, "At least on measure is required"),
  fromXml: z.boolean().optional(),
});
