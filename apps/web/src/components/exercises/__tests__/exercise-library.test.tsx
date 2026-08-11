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

// ─── MOCKS ─────────────────────────────────────────────

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

// One stable router object for the whole file. The real useRouter returns the
// same reference every render, and `writeUrl` has `router` in its deps — a fresh
// object per render would rebuild it every time and restart the debounce timer.
const { mockRouter, mockPush, mockReplace } = vi.hoisted(() => {
  const push = vi.fn();
  const replace = vi.fn();
  return {
    mockRouter: { push, replace },
    mockPush: push,
    mockReplace: replace,
  };
});

// The URL the component reads. Tests set this before rendering.
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => searchParams,
}));

vi.mock("@chops/ui", () => {
  const Popover: any = ({ children }: any) => <div>{children}</div>;
  Popover.Trigger = ({ children }: any) => <div>{children}</div>;
  Popover.Content = ({ children }: any) => <div>{children}</div>;
  Popover.Arrow = () => null;

  return {
    YStack: ({ children, ...props }: any) => (
      <div {...filterProps(props)}>{children}</div>
    ),
    // onPress is wired up because ExerciseCard uses an XStack purely to
    // stopPropagation around the menu. Drop it and menu clicks bubble to the
    // card and fire onEdit, which the real app never does.
    XStack: ({ children, onPress, ...props }: any) => (
      <div onClick={onPress} {...filterProps(props)}>
        {children}
      </div>
    ),
    Body: ({ children }: any) => <p>{children}</p>,
    ErrorText: ({ children }: any) => <p>{children}</p>,
    Chip: ({ children }: any) => <span>{children}</span>,
    // Keeps the real Card's accessibility surface: it is a button.
    Card: ({ children, onPress, ...props }: any) => (
      <div onClick={onPress} role="button" tabIndex={0} {...filterProps(props)}>
        {children}
      </div>
    ),
    // The real Skeleton renders no text or role, so the mock is the only
    // thing that can give the test a handle on it.
    Skeleton: () => <div data-testid="skeleton" />,
    Input: ({ value, onChange, placeholder }: any) => (
      <input value={value} onChange={onChange} placeholder={placeholder} />
    ),
    Button: ({ children, onPress, loading }: any) => (
      <button onClick={onPress} disabled={loading}>
        {children}
      </button>
    ),
    ToggleGroupMulti: ({ options, value, onChange }: any) => (
      <div>
        {options.map((opt: any) => (
          <button
            key={opt}
            aria-pressed={value.includes(opt)}
            onClick={() =>
              onChange(
                value.includes(opt)
                  ? value.filter((v: any) => v !== opt)
                  : [...value, opt],
              )
            }
          >
            {String(opt)}
          </button>
        ))}
      </div>
    ),
    // Mirrors the real ErrorState: a heading, the message, an optional retry.
    // No live region, because the real one does not have one either.
    ErrorState: ({ message, onRetry, title }: any) => (
      <div>
        <h2>{title || "Something went wrong"}</h2>
        <p>{message}</p>
        {onRetry ? <button onClick={onRetry}>Try again</button> : null}
      </div>
    ),
    ConfirmDialog: ({ open, title, confirmLabel, onConfirm }: any) =>
      open ? (
        <div role="alertdialog">
          <h2>{title}</h2>
          <button onClick={onConfirm}>{confirmLabel || "Confirm"}</button>
        </div>
      ) : null,
    MoreVertical: () => <span>more-icon</span>,
    Popover,
  };
});

// Helper: filter out non-DOM props that React would warn about
function filterProps(props: Record<string, any>) {
  const domSafe: Record<string, any> = {};
  for (const [key, val] of Object.entries(props)) {
    if (key.startsWith("$") || key.startsWith("on") || !/^[a-z-]+$/.test(key))
      continue;
    domSafe[key] = val;
  }
  return domSafe;
}

// ─── FIXTURES ──────────────────────────────────────────

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

// Only the debounce test installs fake timers. Restoring here keeps them from
// leaking into whatever runs next.
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

  test("fetches with the filters parsed out of the URL", async () => {
    searchParams = new URLSearchParams(
      "search=flam&tags=rolls,flams&difficulty=2,4",
    );
    mockFetchExercises.mockResolvedValue(page([exercises[1]]));

    render(<ExerciseLibrary />);

    expect(await screen.findByText("Flam Accent")).toBeInTheDocument();
    expect(screen.queryByText("Single Stroke Roll")).not.toBeInTheDocument();

    // Strings in the URL, typed values out of the parser.
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

    // Fake timers go on after the initial load, so `findByText` above can poll
    // on a real clock.
    vi.useFakeTimers();

    // fireEvent, not userEvent: userEvent awaits a real macrotask internally
    // and deadlocks against fake timers. One change event per keystroke is all
    // a controlled input sees anyway.
    const input = screen.getByRole("textbox");
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

    // Tag buttons only exist once fetchExerciseTags resolves.
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

    // Writing: whatever selection comes back is re-joined into the URL.
    // The add/remove logic itself belongs to the real ToggleGroupMulti, which
    // is mocked here — it gets its own tests when packages/ui has a setup.
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

    // Filtering while on page 3 would otherwise land on an empty page.
    expect(mockReplace).toHaveBeenCalledWith("/library?difficulty=2", {
      scroll: false,
    });
  });

  test("a failed first load offers a retry that recovers", async () => {
    // Once: the first call rejects, the second falls through to the resolved
    // value set in beforeEach, so retry has something to succeed with.
    mockFetchExercises.mockRejectedValueOnce(new Error("Network is down"));
    const user = userEvent.setup();

    render(<ExerciseLibrary />);

    expect(await screen.findByText("Network is down")).toBeInTheDocument();
    // Nothing has ever loaded, so there is no list to fall back on.
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

    // What a filter click does in the app: the URL changes, so the effect
    // re-runs. Here `replace` is a spy, so the test drives the URL directly.
    mockFetchExercises.mockRejectedValueOnce(new Error("Network is down"));
    searchParams = new URLSearchParams("tags=rolls");
    rerender(<ExerciseLibrary />);

    expect(await screen.findByText("Network is down")).toBeInTheDocument();
    // The point of this branch: the list survives the failure.
    expect(screen.getByText("Single Stroke Roll")).toBeInTheDocument();
    expect(screen.getByText("Flam Accent")).toBeInTheDocument();
    expect(screen.queryAllByTestId("skeleton")).toHaveLength(0);
    expect(mockFetchExercises).toHaveBeenCalledTimes(2);
  });

  test("ignores a stale response that lands after a newer one", async () => {
    // Each call gets a promise the test holds the resolver for, so the test
    // decides the order they settle in.
    const resolvers: Array<(value: unknown) => void> = [];
    mockFetchExercises.mockImplementation(
      () => new Promise((resolve) => resolvers.push(resolve)),
    );

    const { rerender } = render(<ExerciseLibrary />);

    searchParams = new URLSearchParams("tags=flams");
    rerender(<ExerciseLibrary />);
    expect(mockFetchExercises).toHaveBeenCalledTimes(2);

    // Newer request first, then the stale one it replaced.
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

    // The box seeds itself from the URL on mount.
    expect(screen.getByRole("textbox")).toHaveValue("flam");

    await user.click(screen.getByRole("button", { name: "Clear" }));

    expect(screen.getByRole("textbox")).toHaveValue("");
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
    // Deleting can free up a tag, so the tag list is reloaded.
    expect(mockFetchExerciseTags).toHaveBeenCalledTimes(2);
    // The menu sits inside the card, which is itself a button. If the click
    // bubbled, this would have navigated to the edit page instead.
    expect(mockPush).not.toHaveBeenCalled();
  });
});
