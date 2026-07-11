import { apiClient } from "@/lib/api-client";
import {
  Exercise,
  CreateExerciseRequest,
  UpdateExerciseRequest,
  Paginated,
} from "@chops/shared";

export async function fetchExercises(
  page = 1,
  pageSize = 20,
): Promise<Paginated<Exercise>> {
  const res = await apiClient(`/exercises?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to load exercises");
  }
  return res.json();
}

export async function fetchExerciseById(id: string): Promise<Exercise> {
  const res = await apiClient(`/exercises/${id}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to load exercise");
  }
  return res.json();
}

export async function createExercise(
  exercise: CreateExerciseRequest,
): Promise<Exercise> {
  const res = await apiClient("/exercises", {
    method: "POST",
    body: JSON.stringify(exercise),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create exercise");
  }
  return res.json();
}

export async function updateExercise(
  id: string,
  exercise: UpdateExerciseRequest,
): Promise<Exercise> {
  const res = await apiClient(`/exercises/${id}`, {
    method: "PUT",
    body: JSON.stringify(exercise),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update exercise");
  }
  return res.json();
}

export async function deleteExercise(id: string): Promise<void> {
  const res = await apiClient(`/exercises/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete exercise");
  }
}
