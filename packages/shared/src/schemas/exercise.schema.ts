import z from "zod";

const timeSignatureSegmentSchema = z.object({
  measureCount: z.number().int().min(1),
  timeSigTop: z.number().min(1).max(16),
  timeSigBottom: z
    .number()
    .refine((v) => [4, 8, 16, 32].includes(v), "Must be 4, 8, 16, or 32"),
});

export const createExerciseSchema = z.object({
  title: z.string().min(1, "Exercise name is required"),
  segments: z
    .array(timeSignatureSegmentSchema)
    .min(1, "At least one segment is required"),
  fromXml: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
});

export const updateExerciseSchema = createExerciseSchema.partial();

// Query params are always strings, so list filters arrive comma-joined: "a,b".
const commaList = z.string().transform((s) =>
  s
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean),
);

export const exerciseQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(100).optional(),
  // .pipe() validates what .transform() produced. Transform output is otherwise
  // unchecked, so "1,banana" would sail through as ["1", "banana"].
  tags: commaList.pipe(z.array(z.string())).optional(),
  difficulty: commaList
    .pipe(z.array(z.coerce.number<string>().int().min(1).max(5)))
    .optional(),
});
