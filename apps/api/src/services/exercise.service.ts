import {
  CreateExerciseRequest,
  Exercise,
  ExerciseQueryRequest,
  Paginated,
  UpdateExerciseRequest,
} from "@chops/shared";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../errors/AppError";

export async function createExercise(
  userId: string,
  data: CreateExerciseRequest,
): Promise<Exercise> {
  const exercise = await prisma.exercise.create({
    data: { ...data, userId },
  });

  return exercise as unknown as Exercise;
}

export function buildExerciseWhere(
  userId: string,
  filters: Pick<ExerciseQueryRequest, "search" | "tags" | "difficulty">,
): Prisma.ExerciseWhereInput {
  const { search, tags, difficulty } = filters;

  return {
    userId,
    ...(search && { title: { contains: search, mode: "insensitive" } }),
    ...(tags?.length && { tags: { hasSome: tags } }),
    ...(difficulty?.length && { difficulty: { in: difficulty } }),
  };
}

export async function getExercises(
  userId: string,
  filters: ExerciseQueryRequest,
): Promise<Paginated<Exercise>> {
  const { page, pageSize } = filters;
  const where = buildExerciseWhere(userId, filters);
  const skip = (page - 1) * pageSize;

  const [exercises, total] = await Promise.all([
    prisma.exercise.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.exercise.count({ where }),
  ]);

  return {
    items: exercises as unknown as Exercise[],
    total,
    page,
    pageSize,
  };
}

export async function getExerciseById(
  userId: string,
  exerciseId: string,
): Promise<Exercise> {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId, userId },
  });

  if (!exercise) {
    throw new AppError(404, "Exercise not found");
  }

  return exercise as unknown as Exercise;
}

export async function updateExercise(
  userId: string,
  exerciseId: string,
  data: UpdateExerciseRequest,
): Promise<Exercise> {
  await getExerciseById(userId, exerciseId); // throws 404 if not found

  const exercise = await prisma.exercise.update({
    where: { id: exerciseId },
    data,
  });

  return exercise as unknown as Exercise;
}

export async function deleteExercise(
  userId: string,
  exerciseId: string,
): Promise<void> {
  await getExerciseById(userId, exerciseId); // throws 404 if not found

  const exercise = await prisma.exercise.delete({
    where: { id: exerciseId, userId },
  });

  return;
}

export async function getTags(userId: string): Promise<string[]> {
  const tags = await prisma.exercise.findMany({
    where: { userId },
    select: { tags: true },
  });

  const uniqueTags = new Set<string>();
  tags.forEach((exercise) => {
    exercise.tags.forEach((tag) => uniqueTags.add(tag));
  });

  return Array.from(uniqueTags);
}
