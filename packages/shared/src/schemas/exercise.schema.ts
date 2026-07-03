import z from "zod";

const exerciseMeasureSchema = z.object({
  measureCount: z.number().int().min(1),
  timeSigTop: z.number().min(1).max(16),
  timeSigBottom: z
    .number()
    .refine((v) => [4, 8, 16, 32].includes(v), "Must be 4, 8, 16, or 32"),
});

export const createExerciseSchema = z.object({
  title: z.string().min(1, "Exercise name is required"),
  timeSigChangeMeasures: z
    .array(exerciseMeasureSchema)
    .min(1, "At least one measure is required"),
  fromXml: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
});

export const updateExerciseSchema = createExerciseSchema.partial();
