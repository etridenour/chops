import {
  deleteExercise,
  fetchExercises,
  fetchExerciseTags,
} from "@/lib/api/exercises";
import { getErrorMessage } from "@/lib/errors";
import { Exercise, parseExerciseQuery } from "@chops/shared";
import {
  Button,
  ErrorState,
  ErrorText,
  Input,
  ToggleGroupMulti,
  XStack,
  YStack,
} from "@chops/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ExerciseList } from "./exercise-list";
import { ExerciseListSkeleton } from "./exercise-list-skeleton";

export function ExerciseLibrary() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>(
    searchParams.get("search") || "",
  );
  const [tags, setTags] = useState<string[]>([]);
  // Bumped by the retry button to re-run the fetch effect.
  const [retryCount, setRetryCount] = useState<number>(0);
  const searchParamsString = searchParams.toString();
  const hasActiveFilters = !!searchText || !!searchParamsString;

  const loadTags = useCallback(async () => {
    try {
      const data = await fetchExerciseTags();
      setTags(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  useEffect(() => {
    let ignore = false;

    async function loadExercises() {
      // Runs before any await, so `ignore` can't be true yet — no guards needed here.
      setIsFetching(true);
      setError(null);

      const parsedQuery = parseExerciseQuery(Object.fromEntries(searchParams));
      if (!parsedQuery.ok) {
        setError("Invalid query parameters: " + parsedQuery.errors.join(", "));
        setIsFetching(false);
        return;
      }

      try {
        const data = await fetchExercises(parsedQuery.data);
        if (!ignore) setExercises(data.items);
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err));
      } finally {
        if (!ignore) {
          setIsFetching(false);
          setHasLoaded(true);
        }
      }
    }

    loadExercises();

    return () => {
      ignore = true;
    };
  }, [searchParams, retryCount]);

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
      loadTags();
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
        {hasActiveFilters ? (
          <Button onPress={handleClearFilters}>Clear</Button>
        ) : null}
      </XStack>
      {isFetching && !hasLoaded ? (
        <ExerciseListSkeleton />
      ) : error && !hasLoaded ? (
        // Nothing has ever loaded, so there's no list to fall back on.
        <ErrorState
          message={error}
          onRetry={() => setRetryCount((c) => c + 1)}
        />
      ) : (
        <YStack gap="$2">
          {/* A failed refetch keeps the last good list and reports inline. */}
          {error ? (
            <XStack gap="$2" alignItems="center">
              <ErrorText>{error}</ErrorText>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => setRetryCount((c) => c + 1)}
              >
                Try again
              </Button>
            </XStack>
          ) : null}
          <ExerciseList
            exercises={exercises}
            onEdit={(id) => handleEdit(id)}
            onDelete={(id) => handleDelete(id)}
            isFetching={isFetching}
            hasActiveFilters={hasActiveFilters}
          />
        </YStack>
      )}
    </>
  );
}
