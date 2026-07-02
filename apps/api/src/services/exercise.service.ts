import {
  CreateExerciseRequest,
  Exercise,
  Paginated,
  UpdateExerciseRequest,
} from "@chops/shared";
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

export async function getExercises(
  userId: string,
  page: number,
  pageSize: number,
): Promise<Paginated<Exercise>> {
  const skip = (page - 1) * pageSize;

  const [exercises, total] = await Promise.all([
    prisma.exercise.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.exercise.count({ where: { userId } }),
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
