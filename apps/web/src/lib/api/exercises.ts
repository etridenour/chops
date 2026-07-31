import { apiClient } from "@/lib/api-client";
import {
  Exercise,
  CreateExerciseRequest,
  UpdateExerciseRequest,
  Paginated,
  ExerciseQueryRequest,
} from "@chops/shared";

export async function fetchExercises(
  filters: Partial<ExerciseQueryRequest> = {},
): Promise<Paginated<Exercise>> {
  const paramsString = getParamsString(filters);
  const res = await apiClient(`/exercises${paramsString}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to load exercises");
  }
  return res.json();
}

function getParamsString(filters: Partial<ExerciseQueryRequest>): string {
  const params = new URLSearchParams();
  const { page, pageSize, search, tags, difficulty } = filters;

  if (page) params.set("page", String(page));
  if (pageSize) params.set("pageSize", String(pageSize));
  if (search) params.set("search", search);
  if (tags && tags.length > 0) params.set("tags", tags.join(","));
  if (difficulty && difficulty.length > 0)
    params.set("difficulty", difficulty.join(","));

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
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
