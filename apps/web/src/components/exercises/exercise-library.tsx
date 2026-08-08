import {
  deleteExercise,
  fetchExercises,
  fetchExerciseTags,
} from "@/lib/api/exercises";
import { getErrorMessage } from "@/lib/errors";
import { Exercise, parseExerciseQuery } from "@chops/shared";
import { Button, ErrorState, Input, ToggleGroupMulti, XStack } from "@chops/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ExerciseList } from "./exercise-list";
import { ExerciseListSkeleton } from "./exercise-list-skeleton";

export function ExerciseLibrary() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>(
    searchParams.get("search") || "",
  );
  const [tags, setTags] = useState<string[]>([]);
  const searchParamsString = searchParams.toString();

  useEffect(() => {
    const loadTags = async () => {
      try {
        const data = await fetchExerciseTags();
        setTags(data);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };
    loadTags();
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const parsedQuery = parseExerciseQuery(Object.fromEntries(searchParams));
    let filter = {};
    if (parsedQuery.ok) {
      filter = parsedQuery.data;
    } else {
      setIsLoading(false);
      setError("Invalid query parameters: " + parsedQuery.errors.join(", "));
      return;
    }

    try {
      const data = await fetchExercises(filter);
      setExercises(data.items);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    load();
  }, [load]);

  const writeUrl = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // reset page when filters change
      router.replace(`/library?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    const urlSearchText = searchParams.get("search") || "";
    if (urlSearchText === searchText) return;

    const timeout = setTimeout(() => {
      writeUrl("search", searchText || null);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchText, searchParams, writeUrl]);

  const handleEdit = (id: string) => {
    router.push(`/library/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExercise(id);
      const filteredExercises = exercises.filter((e) => e.id !== id);
      setExercises(filteredExercises);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleClearFilters = () => {
    setSearchText("");
    router.replace(`/library`, { scroll: false });
  };

  return (
    <>
      <XStack flexWrap="wrap" gap="$2">
        <Input
          value={searchText}
          onChange={(e) => setSearchText((e.target as HTMLInputElement).value)}
          placeholder="Search"
        />
        <ToggleGroupMulti
          options={tags}
          value={searchParams.get("tags")?.split(",") || []}
          onChange={(v) => writeUrl("tags", v.join(","))}
        />
        <ToggleGroupMulti
          options={[1, 2, 3, 4, 5]}
          value={searchParams.get("difficulty")?.split(",")?.map(Number) || []}
          onChange={(v) => writeUrl("difficulty", v.join(","))}
        />
        {!!searchText || !!searchParamsString ? (
          <Button onPress={handleClearFilters}>Clear</Button>
        ) : null}
      </XStack>
      {isLoading ? (
        <ExerciseListSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <ExerciseList
          exercises={exercises}
          onEdit={(id) => handleEdit(id)}
          onDelete={(id) => handleDelete(id)}
        />
      )}
    </>
  );
}
