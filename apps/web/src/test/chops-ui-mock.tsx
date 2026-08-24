/**
 * Shared stand-ins for `@chops/ui`.
 *
 * Why this exists: `apps/web` tests mock the design system so app logic can be
 * tested without real Tamagui rendering (see docs/TESTING.md, "The mock
 * boundary"). Seventeen test files were each carrying their own copy, eight of
 * them with their own `filterProps`, and the copies drifted. When production
 * gained live regions in the Aug 2026 a11y pass, six files had to be corrected
 * by hand and one comment was left asserting the opposite of what shipped.
 *
 * Rules for editing this file:
 *
 * 1. A stand-in must not claim an accessibility surface production lacks. A
 *    test that passes against an invented role is worse than no test.
 * 2. Where a stand-in deliberately differs from production, say so in a comment
 *    directly above it, and say what production actually does.
 * 3. Prefer fixing production over enriching the mock. Several of these stand-ins
 *    exist only because the real component has no queryable handle.
 *
 * To use it, with no changes:
 *
 *   vi.mock("@chops/ui", async () => (await import("@/test/chops-ui-mock")).mocks)
 *
 * To override one component for a single file:
 *
 *   vi.mock("@chops/ui", async () => {
 *     const { mocks } = await import("@/test/chops-ui-mock");
 *     return { ...mocks, Skeleton: () => <div data-testid="row" /> };
 *   })
 *
 * The factory has to be async. `vi.mock` is hoisted above the imports, so a
 * top-level import of this module would not exist yet when the factory runs.
 */

/**
 * Strips props that Tamagui accepts but the DOM does not, so React stops
 * warning about unknown attributes.
 *
 * This is an allowlist, not a pattern. An earlier version kept every
 * lowercase key, which looked tidy but let Tamagui's lowercase style props
 * (`gap`, `opacity`, `flex`, `position`) through onto the element — they are
 * CSS, not HTML attributes. Anything not named here is dropped, so a new prop
 * fails loudly by going missing rather than quietly landing in the DOM.
 *
 * Every `on*` handler is dropped too. A stand-in that forwards `onPress` to a
 * `<div>` invents click behaviour the real component may not have; wire them
 * explicitly on the components that really are interactive.
 */
const DOM_ATTRS = new Set([
  "id",
  "type",
  "name",
  "value",
  "placeholder",
  "href",
  "src",
  "alt",
  "title",
  "role",
  "disabled",
  "required",
  "checked",
  "readOnly",
  "tabIndex",
  "htmlFor",
  "autoComplete",
  "maxLength",
  "min",
  "max",
  "step",
]);

export function filterProps(props: Record<string, any>) {
  const domSafe: Record<string, any> = {};
  for (const [key, val] of Object.entries(props)) {
    if (key.startsWith("on")) continue;
    if (key.startsWith("aria-") || key.startsWith("data-") || DOM_ATTRS.has(key))
      domSafe[key] = val;
  }
  return domSafe;
}

const Popover: any = ({ children }: any) => <div>{children}</div>;
Popover.Trigger = ({ children }: any) => <div>{children}</div>;
Popover.Content = ({ children }: any) => <div>{children}</div>;
Popover.Arrow = () => null;

export const mocks = {
  // ─── Layout ──────────────────────────────────────────

  YStack: ({ children, ...props }: any) => (
    <div {...filterProps(props)}>{children}</div>
  ),
  // `onPress` is wired because ExerciseCard uses an XStack purely to
  // stopPropagation around the menu. Drop it and menu clicks bubble to the card
  // and fire onEdit, which the real app never does.
  XStack: ({ children, onPress, ...props }: any) => (
    <div onClick={onPress} {...filterProps(props)}>
      {children}
    </div>
  ),
  Separator: () => <hr />,
  Spinner: () => <span>loading...</span>,

  // ─── Text ────────────────────────────────────────────

  H1: ({ children }: any) => <h1>{children}</h1>,
  H2: ({ children }: any) => <h2>{children}</h2>,
  Body: ({ children }: any) => <p>{children}</p>,
  Label: ({ children, htmlFor }: any) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
  // Production is a `<p role="alert" aria-live="assertive">`. Both are real as
  // of the Aug 2026 a11y pass — do not drop them, tests assert announcements.
  ErrorText: ({ children }: any) => (
    <p role="alert" aria-live="assertive">
      {children}
    </p>
  ),
  LinkText: ({ children }: any) => <span>{children}</span>,

  // ─── Controls ────────────────────────────────────────

  // Mirrors production: `disabled` and `loading` both block the press and set
  // `aria-disabled`, and neither sets the DOM `disabled` attribute, so the
  // control stays focusable.
  //
  // One deliberate difference: production swaps the children for a spinning
  // drum while loading and keeps the name alive via `aria-label`. This keeps
  // the children rendered, so `getByText` on a loading button passes here and
  // would fail against the real component.
  Button: ({ children, onPress, loading, disabled, ...props }: any) => {
    const isDisabled = disabled || loading;
    return (
      <button
        onClick={isDisabled ? undefined : onPress}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        aria-label={props["aria-label"]}
      >
        {children}
      </button>
    );
  },
  Input: ({ id, value, onChange, error, placeholder, ...props }: any) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-invalid={error || undefined}
      aria-label={props["aria-label"]}
      {...filterProps(props)}
    />
  ),
  ToggleGroup: ({ options, value, onChange, allowDeselect }: any) => (
    <div>
      {options.map((opt: any) => (
        <button
          key={opt}
          aria-pressed={value === opt}
          onClick={() =>
            onChange(allowDeselect && value === opt ? undefined : opt)
          }
        >
          {String(opt)}
        </button>
      ))}
    </div>
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

  // ─── Surfaces ────────────────────────────────────────

  // The real Card is a styled YStack with no role, tabIndex, or key handling —
  // ExerciseCard hand-rolls all three on top of it. This mirrors what that
  // call site produces, including onKeyDown, which is the only reason Enter and
  // Space activate a card at all.
  Card: ({ children, onPress, onKeyDown, ...props }: any) => (
    <div
      onClick={onPress}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      {...filterProps(props)}
    >
      {children}
    </div>
  ),
  // The real Chip renders text in a styled view with no role, so this test id
  // is the only handle. A gap in the component, not a feature here.
  Chip: ({ children }: any) => <span data-testid="chip">{children}</span>,
  // The real Skeleton renders no text and no role, so this test id is the only
  // handle a test can get. That is a gap in the component, not a feature here.
  Skeleton: () => <div data-testid="skeleton" />,
  // Production wraps the heading, message, and retry in one live region, so the
  // announcement includes the way out and not just the bad news.
  ErrorState: ({ message, onRetry, title }: any) => (
    <div role="alert" aria-live="assertive">
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
  Popover,

  // ─── Icons ───────────────────────────────────────────
  //
  // Re-exported from lucide through the barrel. They render an <svg> with no
  // accessible name in production, so these carry test ids instead of roles.

  Home: () => <svg data-testid="nav-icon" />,
  Drum: () => <svg data-testid="nav-icon" />,
  LogOut: () => <svg data-testid="logout-icon" />,
  Menu: () => <svg data-testid="menu-icon" />,
  X: () => <svg data-testid="x-icon" />,
  MoreVertical: () => <span>more-icon</span>,
  Eye: () => <span>eye-icon</span>,
  EyeOff: () => <span>eyeoff-icon</span>,
};
