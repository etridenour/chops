import { Exercise } from "@chops/shared";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ExerciseLibrary } from "../exercise-library";

const { mockFetchExercises, mockFetchExerciseTags, mockDeleteExercise } =
  vi.hoisted(() => ({
    mockFetchExercises: vi.fn(),
    mockFetchExerciseTags: vi.fn(),
    mockDeleteExercise: vi.fn(),
  }));

vi.mock("@/lib/api/exercises", () => ({
  fetchExercises: mockFetchExercises,
  fetchExerciseTags: mockFetchExerciseTags,
  deleteExercise: mockDeleteExercise,
}));

const { mockRouter, mockPush, mockReplace } = vi.hoisted(() => {
  const push = vi.fn();
  const replace = vi.fn();
  return {
    mockRouter: { push, replace },
    mockPush: push,
    mockReplace: replace,
  };
});

let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => searchParams,
}));

vi.mock("@chops/ui", async () => (await import("@/test/chops-ui-mock")).mocks);

const exercises: Exercise[] = [
  {
    id: "ex1",
    title: "Single Stroke Roll",
    segments: [{ measureCount: 4, timeSigTop: 4, timeSigBottom: 4 }],
    tags: ["rolls"],
    difficulty: 2,
    fromXml: false,
  },
  {
    id: "ex2",
    title: "Flam Accent",
    segments: [{ measureCount: 8, timeSigTop: 6, timeSigBottom: 8 }],
    tags: ["flams"],
    difficulty: 4,
    fromXml: false,
  },
];

function page(items: Exercise[]) {
  return { items, total: items.length, page: 1, pageSize: 20 };
}

beforeEach(() => {
  vi.clearAllMocks();
  searchParams = new URLSearchParams();
  mockFetchExercises.mockResolvedValue(page(exercises));
  mockFetchExerciseTags.mockResolvedValue(["rolls", "flams"]);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ExerciseLibrary", () => {
  test("shows the skeleton first, then the fetched exercises", async () => {
    render(<ExerciseLibrary />);

    // Synchronous: the fetch promise has been created but has not settled.
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
    expect(screen.queryByText("Flam Accent")).not.toBeInTheDocument();

    expect(await screen.findByText("Single Stroke Roll")).toBeInTheDocument();
    expect(screen.getByText("Flam Accent")).toBeInTheDocument();
    expect(screen.queryAllByTestId("skeleton")).toHaveLength(0);
  });

  test("ties the visible label to the search box", async () => {
    render(<ExerciseLibrary />);

    const label = screen.getByText("Search");
    const input = screen.getByLabelText("Search");

    expect(label).toHaveAttribute("for", input.id);
    expect(input.id).not.toBe("");
  });

  test("gives the search box an aria-label for native", async () => {
    render(<ExerciseLibrary />);

    expect(screen.getByLabelText("Search")).toHaveAttribute(
      "aria-label",
      "Search",
    );
  });

  test("fetches with the filters parsed out of the URL", async () => {
    searchParams = new URLSearchParams(
      "search=flam&tags=rolls,flams&difficulty=2,4",
    );
    mockFetchExercises.mockResolvedValue(page([exercises[1]]));

    render(<ExerciseLibrary />);

    expect(await screen.findByText("Flam Accent")).toBeInTheDocument();
    expect(screen.queryByText("Single Stroke Roll")).not.toBeInTheDocument();

    expect(mockFetchExercises).toHaveBeenCalledTimes(1);
    expect(mockFetchExercises).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      search: "flam",
      tags: ["rolls", "flams"],
      difficulty: [2, 4],
    });
  });

  test("shows an error and skips the fetch when the URL is invalid", async () => {
    searchParams = new URLSearchParams("difficulty=9");

    render(<ExerciseLibrary />);

    expect(
      await screen.findByText(/invalid query parameters/i),
    ).toBeInTheDocument();
    expect(mockFetchExercises).not.toHaveBeenCalled();
    expect(screen.queryAllByTestId("skeleton")).toHaveLength(0);
  });

  test("writes the search to the URL once, after the debounce", async () => {
    render(<ExerciseLibrary />);
    expect(await screen.findByText("Single Stroke Roll")).toBeInTheDocument();

    vi.useFakeTimers();

    const input = screen.getByLabelText("Search");
    for (const value of ["f", "fl", "fla", "flam"]) {
      fireEvent.change(input, { target: { value } });
    }
    expect(mockReplace).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    expect(mockReplace).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/library?search=flam", {
      scroll: false,
    });
  });

  test("clicking a tag adds it to the URL", async () => {
    const user = userEvent.setup();
    render(<ExerciseLibrary />);

    await user.click(await screen.findByRole("button", { name: "rolls" }));

    expect(mockReplace).toHaveBeenCalledWith("/library?tags=rolls", {
      scroll: false,
    });
  });

  test("feeds the URL's tags into the toggles and writes the result back", async () => {
    searchParams = new URLSearchParams("tags=rolls,flams");
    const user = userEvent.setup();
    render(<ExerciseLibrary />);

    // Reading: the comma-separated URL value became the toggle's selection.
    const rolls = await screen.findByRole("button", { name: "rolls" });
    expect(rolls).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "flams" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(rolls);

    expect(mockReplace).toHaveBeenCalledWith("/library?tags=flams", {
      scroll: false,
    });
  });

  test("changing a filter drops the page param", async () => {
    searchParams = new URLSearchParams("page=3");
    const user = userEvent.setup();
    render(<ExerciseLibrary />);
    await screen.findByText("Single Stroke Roll");

    await user.click(screen.getByRole("button", { name: "2" }));

    expect(mockReplace).toHaveBeenCalledWith("/library?difficulty=2", {
      scroll: false,
    });
  });

  test("a failed first load offers a retry that recovers", async () => {
    mockFetchExercises.mockRejectedValueOnce(new Error("Network is down"));
    const user = userEvent.setup();

    render(<ExerciseLibrary />);

    expect(await screen.findByText("Network is down")).toBeInTheDocument();
    expect(screen.queryByText("Single Stroke Roll")).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("skeleton")).toHaveLength(0);

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("Single Stroke Roll")).toBeInTheDocument();
    expect(screen.queryByText("Network is down")).not.toBeInTheDocument();
    expect(mockFetchExercises).toHaveBeenCalledTimes(2);
  });

  test("a failed refetch keeps the last good list and reports inline", async () => {
    const { rerender } = render(<ExerciseLibrary />);
    expect(await screen.findByText("Single Stroke Roll")).toBeInTheDocument();

    mockFetchExercises.mockRejectedValueOnce(new Error("Network is down"));
    searchParams = new URLSearchParams("tags=rolls");
    rerender(<ExerciseLibrary />);

    expect(await screen.findByText("Network is down")).toBeInTheDocument();
    expect(screen.getByText("Single Stroke Roll")).toBeInTheDocument();
    expect(screen.getByText("Flam Accent")).toBeInTheDocument();
    expect(screen.queryAllByTestId("skeleton")).toHaveLength(0);
    expect(mockFetchExercises).toHaveBeenCalledTimes(2);
  });

  test("ignores a stale response that lands after a newer one", async () => {
    const resolvers: Array<(value: unknown) => void> = [];
    mockFetchExercises.mockImplementation(
      () => new Promise((resolve) => resolvers.push(resolve)),
    );

    const { rerender } = render(<ExerciseLibrary />);

    searchParams = new URLSearchParams("tags=flams");
    rerender(<ExerciseLibrary />);
    expect(mockFetchExercises).toHaveBeenCalledTimes(2);

    await act(async () => {
      resolvers[1](page([exercises[1]]));
    });
    await act(async () => {
      resolvers[0](page([exercises[0]]));
    });

    expect(screen.getByText("Flam Accent")).toBeInTheDocument();
    expect(screen.queryByText("Single Stroke Roll")).not.toBeInTheDocument();
  });

  test("shows Clear only once a filter is active", async () => {
    const { rerender } = render(<ExerciseLibrary />);
    await screen.findByText("Single Stroke Roll");

    expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();

    searchParams = new URLSearchParams("tags=rolls");
    rerender(<ExerciseLibrary />);

    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  test("Clear empties the search box and the URL", async () => {
    searchParams = new URLSearchParams("search=flam&tags=rolls");
    const user = userEvent.setup();
    render(<ExerciseLibrary />);
    await screen.findByText("Single Stroke Roll");

    expect(screen.getByLabelText("Search")).toHaveValue("flam");

    await user.click(screen.getByRole("button", { name: "Clear" }));

    expect(screen.getByLabelText("Search")).toHaveValue("");
    expect(mockReplace).toHaveBeenCalledWith("/library", { scroll: false });
  });

  test("deleting an exercise drops it from the list", async () => {
    mockDeleteExercise.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ExerciseLibrary />);

    const card = await screen.findByRole("button", {
      name: /Single Stroke Roll/,
    });
    await user.click(within(card).getByRole("button", { name: "Delete" }));

    const dialog = screen.getByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(screen.queryByText("Single Stroke Roll")).not.toBeInTheDocument(),
    );
    expect(mockDeleteExercise).toHaveBeenCalledWith("ex1");
    expect(screen.getByText("Flam Accent")).toBeInTheDocument();
    expect(mockFetchExerciseTags).toHaveBeenCalledTimes(2);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
