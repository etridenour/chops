# Testing Guide

A beginner-friendly reference for writing and running tests in this project.

## Why We Test

Tests are code that checks your other code. Instead of manually opening the browser, typing into a form, and visually checking if things work after every change, tests automate that process. You run one command and get a pass/fail report in seconds.

Tests catch bugs before users do, and give you confidence to refactor code without breaking things.

## Our Testing Stack

| Tool | What It Does |
|---|---|
| **Vitest** | The test runner. It finds test files, runs them, and tells you what passed or failed. Think of it like the engine — everything else plugs into it. |
| **happy-dom** | A fake browser that runs inside Node.js. Your tests run in a terminal, not a real browser, so there's no `document` or `window`. happy-dom simulates those so React components can render. It's faster than the older `jsdom` alternative and has better ESM compatibility. |
| **React Testing Library (RTL)** | Gives you tools to render React components and find elements on the "screen." Instead of checking internal state or implementation details, it lets you test what the user actually sees and interacts with. |
| **@testing-library/user-event** | Simulates real user interactions — typing, clicking, tabbing. More realistic than RTL's basic `fireEvent` because it triggers the full chain of browser events (focus → keydown → input → keyup → change). |
| **@testing-library/jest-dom** | Adds extra assertions (the `expect(...).toSomething()` checks) that are specific to DOM elements. Things like `toBeInTheDocument()`, `toHaveTextContent()`, `toBeVisible()`. Without it, you'd only have generic checks like `toBe(true)`. |
| **Playwright** | The end-to-end runner. Drives a real browser against the real stack. Separate from everything else in this table — see [End-to-End Tests](#end-to-end-tests-playwright). |
| **@vitejs/plugin-react** | Lets Vitest understand JSX/TSX files (the `<Component />` syntax). Without it, Vitest would see JSX and not know what to do with it. |

## Running Tests

```bash
# Run ALL tests across every package (via Turborepo)
pnpm test

# Run tests for a specific package
pnpm --filter @chops/shared test
pnpm --filter @chops/web test
pnpm --filter @chops/ui test

# Run tests in watch mode (re-runs when files change — great during development)
cd packages/shared && npx vitest
cd apps/web && npx vitest

# Run a single test file
cd packages/shared && npx vitest run src/validators/__tests__/auth.validator.test.ts

# Run tests whose name matches a pattern
cd packages/shared && npx vitest run -t "empty email"
```

`vitest run` = run once and exit (good for CI, quick checks).
`vitest` (no `run`) = watch mode, re-runs on file changes (good during development).

## Where Test Files Go

Test files live in a `__tests__/` folder next to the code they test:

```
packages/shared/
  src/
    validators/
      auth.validator.ts          ← the code
      __tests__/
        auth.validator.test.ts   ← the test

apps/web/
  src/
    app/
      login/
        page.tsx                 ← the code
        __tests__/
          page.test.tsx          ← the test
```

**Naming convention:** `{filename}.test.ts` (or `.test.tsx` for components). Vitest automatically finds files matching `**/*.test.{ts,tsx}`.

Exception: `packages/ui` keeps its test helpers in `src/test/` (setup file, render helper, smoke test), and component tests will sit in `__tests__/` folders like everywhere else.

## How the Setup Fits Together

Each package that has tests owns three pieces:

1. **A `test` script** in its `package.json` (`vitest run`). The root `pnpm test` runs them all through Turborepo.
2. **A `vitest.config.ts`** declaring the environment (happy-dom), globals, and a setup file.
3. **A setup file** (`src/test/setup.ts`) that loads jest-dom's matchers.

The testing devDependencies (vitest, happy-dom, testing-library) live once in the **root** `package.json`, shared by the whole workspace. Individual packages don't re-declare them.

### The mock boundary

The same component is treated differently depending on which package the test lives in:

- **`apps/web` tests mock `@chops/ui`** with plain DOM stand-ins. Those tests care about app logic (fetching, filtering, navigation), and real Tamagui rendering would add noise.
- **`packages/ui` tests render real Tamagui.** The components ARE Tamagui; mocking it would leave nothing to test. This is where component logic (variants, select/deselect behavior) gets its coverage.

Rule of thumb: a package tests the logic it owns, and mocks what it imports from below.

### The shared `@chops/ui` stand-ins

`apps/web/src/test/chops-ui-mock.tsx` holds one set of DOM stand-ins for the whole web test suite. Every web test file that renders a `@chops/ui` component uses it. Before it existed, seventeen test files each carried their own copy and the copies drifted apart; when production gained live regions in the Aug 2026 a11y pass, six files had to be corrected by hand.

Use it as-is:

```ts
vi.mock("@chops/ui", async () => (await import("@/test/chops-ui-mock")).mocks);
```

Override one component for a single file:

```ts
vi.mock("@chops/ui", async () => {
  const { mocks } = await import("@/test/chops-ui-mock");
  return { ...mocks, Skeleton: () => <div data-testid="row" /> };
});
```

The factory has to be `async`. `vi.mock` is hoisted above the imports, so a top-level import of the mock module would not exist yet when the factory runs.

**Rules for editing the stand-ins:**

1. **A stand-in must not claim an accessibility surface production lacks.** A test that passes against an invented role is worse than no test.
2. **Where a stand-in deliberately differs from production, say so in a comment above it,** and say what production actually does. This is the one case where a comment in that file earns its place, because no test can catch the mock lying about the real component.
3. **Prefer fixing production over enriching the mock.** Several stand-ins carry a `data-testid` only because the real component exposes no queryable handle. `Chip` and `Skeleton` are the current examples, and the icons re-exported from lucide render an `<svg>` with no accessible name. Each of those is a gap in the component, not a feature of the mock.
4. **`filterProps` is an allowlist, not a pattern.** It drops every prop not named in `DOM_ATTRS` (plus anything `aria-*` or `data-*`). An earlier version kept every lowercase key, which let Tamagui's lowercase style props (`gap`, `opacity`, `flex`, `position`) through onto the element, where they are not valid HTML attributes. It also drops every `on*` handler, so a stand-in cannot invent click behavior the real component lacks. Wire handlers explicitly on the components that really are interactive.

### Why the `packages/ui` config is bigger

Rendering real Tamagui in a fake browser needs extra plumbing that the web app's tests never needed:

- **Provider wrapper.** Tamagui components need `TamaguiProvider` with the design-system config, or no tokens/themes resolve. The helper in `packages/ui/src/test/render.tsx` bakes this in — import `render` and `screen` from there, not from `@testing-library/react`.
- **react-native aliases.** Tamagui imports `react-native`, which ships Flow-typed source that vitest can't parse. The config aliases it to `react-native-web` (and `react-native-svg` to `react-native-svg-web`), mirroring what `apps/web/next.config.ts` does for the real site.
- **Inlined dependencies.** Vitest normally runs node_modules packages natively through Node, where those aliases don't apply. `server.deps.inline` forces the icon packages through vitest's transformer so their internal react-native imports get rewritten too.
- **Two tsconfigs.** `tsconfig.json` (used by `lint` and the IDE) knows about vitest globals and typechecks tests. `tsconfig.build.json` (used by `build`) excludes tests so compiled copies never land in `dist/` — vitest once picked up a stale compiled test there and ran it as a second file.

## Anatomy of a Test File

Every test file follows the same basic structure:

```ts
// 1. Imports
import { describe, test, expect } from "vitest";
import { myFunction } from "../myFunction";

// 2. Group related tests with describe()
describe("myFunction", () => {

  // 3. Individual test cases
  test("does something expected", () => {

    // 4. Call the code
    const result = myFunction("input");

    // 5. Assert the result
    expect(result).toBe("expected output");
  });
});
```

### Breaking it down:

- **`describe("name", fn)`** — Groups related tests. Like a folder for test cases. You can nest them.
- **`test("name", fn)`** or **`it("name", fn)`** — A single test case. The name should describe the expected behavior. `test` and `it` are identical — `it` reads more like English: `it("returns empty array for valid input")`.
- **`expect(value)`** — Creates an assertion. Chain it with a "matcher" to check the value.
- **Matchers** — The `.toBe()`, `.toEqual()`, etc. part. They define _how_ to check the value.

## Writing a Unit Test (Pure Functions)

Unit tests are for functions that take input and return output with no side effects. These are the easiest to test.

```ts
import { describe, test, expect } from "vitest";
import { validateLogin } from "../../validators/auth.validator";

describe("validateLogin", () => {
  // HAPPY PATH: valid input
  test("returns empty array for valid input", () => {
    const errors = validateLogin({ email: "a@b.com", password: "pass123" });
    expect(errors).toEqual([]);
  });

  // SAD PATH: invalid input
  test("returns error for empty email", () => {
    const errors = validateLogin({ email: "", password: "pass123" });
    expect(errors.length).toBeGreaterThan(0);
  });
});
```

**Pattern:** Call the function → check the return value. That's it.

**Tip:** Always test the happy path first (valid input, expected behavior), then test each way things can go wrong (empty fields, bad formats, edge cases).

## Writing a Component Test

Component tests render a React component, simulate user actions, and check what appears on screen.

```tsx
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyComponent from "../MyComponent";

describe("MyComponent", () => {
  test("shows a greeting", () => {
    // render() puts the component into the fake DOM
    render(<MyComponent name="Eric" />);

    // screen.getByText() finds an element by its visible text
    expect(screen.getByText("Hello, Eric!")).toBeInTheDocument();
  });

  test("calls onSubmit when button is clicked", async () => {
    const handleSubmit = vi.fn(); // create a mock function
    const user = userEvent.setup(); // create a user simulation

    render(<MyComponent onSubmit={handleSubmit} />);

    await user.click(screen.getByText("Submit"));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
```

**Pattern:** Render → find elements → interact → assert.

## Mocking

Mocking replaces real code with fake versions you control. You mock things when:

- The real code calls an API (you don't want tests hitting a real server)
- The real code uses browser features that don't exist in tests (navigation, cookies)
- You want to test how your code handles success vs failure from a dependency

### Mocking a module

```ts
import { vi } from "vitest";

// Replace the entire module with a fake
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    login: vi.fn(),
    user: null,
  }),
}));
```

### Mocking a function

```ts
const mockLogin = vi.fn();

// Make it return a specific value
mockLogin.mockReturnValue("success");

// Make it return a resolved promise (for async functions)
mockLogin.mockResolvedValue({ user: { id: 1 } });

// Make it throw an error (for testing error handling)
mockLogin.mockRejectedValue(new Error("Network error"));

// Check if it was called
expect(mockLogin).toHaveBeenCalled();
expect(mockLogin).toHaveBeenCalledWith("arg1", "arg2");
expect(mockLogin).toHaveBeenCalledTimes(1);
expect(mockLogin).not.toHaveBeenCalled();
```

### Reset mocks between tests

```ts
import { beforeEach } from "vitest";

beforeEach(() => {
  mockLogin.mockReset(); // clears all recorded calls and return values
});
```

Always reset mocks in `beforeEach` so one test doesn't affect another.

## Async Testing

When testing async operations (API calls, promises), use `async/await`:

```ts
test("handles async operation", async () => {
  const user = userEvent.setup();
  render(<MyComponent />);

  await user.click(screen.getByText("Load Data"));

  // waitFor() retries until the assertion passes or times out.
  // Use this when the DOM updates after an async operation.
  await waitFor(() => {
    expect(screen.getByText("Data loaded")).toBeInTheDocument();
  });
});
```

**Why `waitFor`?** After an async action (like a button click that triggers an API call), React needs time to re-render. `waitFor` keeps checking until the expected element appears, rather than checking once and failing because the render hasn't happened yet.

## Common Assertions Cheat Sheet

```ts
// Equality
expect(value).toBe(5);                    // exact equality (===)
expect(value).toEqual({ a: 1 });          // deep equality (objects/arrays)
expect(value).not.toBe(3);                // negation — works with any matcher

// Truthiness
expect(value).toBeTruthy();               // anything truthy
expect(value).toBeFalsy();                // null, undefined, 0, "", false
expect(value).toBeNull();                 // exactly null
expect(value).toBeUndefined();            // exactly undefined
expect(value).toBeDefined();              // anything except undefined

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(10);
expect(value).toBeGreaterThanOrEqual(5);

// Strings
expect(str).toContain("hello");           // substring check
expect(str).toMatch(/pattern/);           // regex match

// Arrays
expect(arr).toContain("item");            // array includes item
expect(arr).toHaveLength(3);              // array length

// DOM (from @testing-library/jest-dom)
expect(element).toBeInTheDocument();      // element exists in DOM
expect(element).toBeVisible();            // element is visible
expect(element).toHaveTextContent("hi");  // element contains text
expect(element).toHaveAttribute("type", "password");
expect(element).toBeDisabled();
expect(element).toBeEnabled();
expect(element).toHaveValue("input text"); // form input value
```

## Common Queries Cheat Sheet

These are the functions from React Testing Library for finding elements on screen.

```ts
// BY ROLE (preferred — tests accessibility too)
screen.getByRole("button");                        // <button>
screen.getByRole("button", { name: "Submit" });    // <button>Submit</button>
screen.getByRole("textbox");                        // <input type="text">
screen.getByRole("alert");                          // <div role="alert">
screen.getByRole("heading", { level: 1 });         // <h1>

// BY LABEL (best for form inputs)
screen.getByLabelText("Email");     // input associated with a <label>

// BY TEXT (for non-interactive elements)
screen.getByText("Hello world");    // any element containing this text
screen.getByText(/hello/i);         // case-insensitive regex match

// BY TEST ID (last resort — when nothing else works)
screen.getByTestId("my-widget");    // element with data-testid="my-widget"

// QUERY variants (return null instead of throwing)
screen.queryByText("Maybe here");   // returns null if not found
// Use queryBy when you want to assert something does NOT exist:
expect(screen.queryByText("Error")).not.toBeInTheDocument();

// FIND variants (async — waits for element to appear)
await screen.findByText("Loaded");  // retries until found or timeout
```

### Which query should I use?

1. **`getByRole`** — first choice. Uses accessibility roles, so it also verifies your app is accessible.
2. **`getByLabelText`** — for form fields. Verifies labels are connected.
3. **`getByText`** — for plain text content.
4. **`getByTestId`** — last resort. Requires adding `data-testid` attributes to your code.

### get vs query vs find?

| Prefix | Not found? | Async? | When to use |
|---|---|---|---|
| `getBy` | Throws error | No | Element should exist right now |
| `queryBy` | Returns null | No | Asserting element does NOT exist |
| `findBy` | Throws error | Yes | Element will appear after async work |

## End-to-End Tests (Playwright)

Everything above runs code in a fake browser with the network mocked. End-to-end tests run the
whole stack for real: a real browser driving the real Next.js app against the real Express API
and a real Postgres. Nothing is mocked. They catch the bugs that only exist between the pieces,
and they are slower and flakier, so there are few of them and they cover journeys, not details.

They live in the `e2e/` workspace package (`@chops/e2e`) and are **not** part of `pnpm test`.

### Running them

```bash
pnpm e2e          # install browser if needed, start containers, migrate, run specs
pnpm e2e:down     # stop the containers when you're finished
```

`pnpm e2e` deliberately leaves the containers running, so a failed run leaves the database and
the Mailpit inbox open for inspection. Mailpit's web UI is at http://localhost:8025.

Other entry points:

```bash
pnpm --filter @chops/e2e e2e:ui       # time-travel runner — the tool to actually debug in
pnpm --filter @chops/e2e e2e:report   # open the HTML report from the last run
```

### What's required on a fresh clone

`pnpm install` is not enough. The Chromium build Playwright drives is a separate ~95MB download
that lives in an OS-level cache, not in `node_modules`. `pnpm e2e` runs `playwright install`
first so this can't be forgotten; it's a no-op (about a second) once the browser is present, and
it also picks up the new build whenever `@playwright/test` is upgraded.

Docker must be running. The containers are defined in `docker-compose.e2e.yml`.

### How the environment is wired

- **Postgres** on host port `5433`, so it can never collide with your dev database on `5432`.
  Its data lives in `tmpfs`, so `e2e:down` then `e2e` gives a guaranteed-clean database.
- **Mailpit** on `1025` (SMTP) and `8025` (HTTP). It is a fake mail server: it accepts mail and
  never delivers it. Tests read the verification email from its HTTP API to get the signup token,
  which is the only way to complete an account in a test. It also stops `signup/start` from
  failing on missing Gmail credentials.
- **The apps** are started by Playwright's `webServer`, API on `4001` and web on `3001`, with env
  overrides pointing them at the test database and at Mailpit. Playwright stops them afterwards.
  `reuseExistingServer: false` prevents silently attaching to a `pnpm dev` server that is pointed
  at your real data.

### Rules for writing them

- **Every test creates its own data.** Unique emails (`user-<random>@example.test`), never a
  shared fixture user. This is what makes parallel runs safe; a shared account would force the
  suite to run one test at a time.
- **Same selector discipline as the unit tests**: `getByRole` and `getByLabel` first,
  `data-testid` last. The selector is where the test is glued to the markup, and CSS-path
  selectors turn every restyle into a red build.
- **Never write a manual wait.** Playwright retries every action until the element is present,
  visible and clickable. A hardcoded sleep is a smell.
- **Use the `request` fixture for setup.** Driving the UI to create data you already know how to
  create over HTTP is the main reason e2e suites get slow.

## What to Test (and What Not To)

### Do test:
- Pure functions (validators, formatters, calculators)
- User interactions (click submit → error appears, or login is called)
- Conditional rendering (error messages, loading states, empty states)
- Both success and failure paths for async operations

### Don't test:
- Third-party library internals (Tamagui renders correctly, React useState works). Note: `packages/ui` tests *render* real Tamagui, but they still assert our own component logic (variants, callbacks, select behavior), not Tamagui's.
- CSS/styling details
- Implementation details (internal state values, private methods)
- That Next.js `<Link>` navigates — that's Next.js's job

### Rule of thumb:
If it can break in a way that affects the user, test it. If it can only break because a library you depend on broke, don't test it — that's their job.
