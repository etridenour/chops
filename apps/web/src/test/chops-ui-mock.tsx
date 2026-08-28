// See docs/TESTING.md, "The shared `@chops/ui` stand-ins", before editing.

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
    if (
      key.startsWith("aria-") ||
      key.startsWith("data-") ||
      DOM_ATTRS.has(key)
    )
      domSafe[key] = val;
  }
  return domSafe;
}

const Popover: any = ({ children }: any) => <div>{children}</div>;
Popover.Trigger = ({ children }: any) => <div>{children}</div>;
Popover.Content = ({ children }: any) => <div>{children}</div>;
Popover.Arrow = () => null;

export const mocks = {
  YStack: ({ children, ...props }: any) => (
    <div {...filterProps(props)}>{children}</div>
  ),
  // Differs from production: the real XStack has no press handling. `onPress` is
  // wired here because ExerciseCard uses an XStack purely to stopPropagation
  // around the menu, and without it menu clicks bubble to the card and fire
  // onEdit.
  XStack: ({ children, onPress, ...props }: any) => (
    <div onClick={onPress} {...filterProps(props)}>
      {children}
    </div>
  ),
  Separator: () => <hr />,
  Spinner: () => <span>loading...</span>,

  H1: ({ children }: any) => <h1>{children}</h1>,
  H2: ({ children }: any) => <h2>{children}</h2>,
  Body: ({ children }: any) => <p>{children}</p>,
  Label: ({ children, htmlFor }: any) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
  ErrorText: ({ children }: any) => (
    <p role="alert" aria-live="assertive">
      {children}
    </p>
  ),
  LinkText: ({ children }: any) => <span>{children}</span>,

  // Differs from production: while loading, the real Button swaps its children
  // for a spinning drum and keeps the name alive via `aria-label`. This keeps
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

  // Differs from production: the real Card is a styled YStack with no role,
  // tabIndex, or key handling. ExerciseCard hand-rolls all three on top of it,
  // and this mirrors what that call site produces rather than the component.
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
  Chip: ({ children }: any) => <span data-testid="chip">{children}</span>,
  Skeleton: () => <div data-testid="skeleton" />,
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

  Home: () => <svg data-testid="nav-icon" />,
  Drum: () => <svg data-testid="nav-icon" />,
  LogOut: () => <svg data-testid="logout-icon" />,
  Menu: () => <svg data-testid="menu-icon" />,
  X: () => <svg data-testid="x-icon" />,
  MoreVertical: () => <span>more-icon</span>,
  Eye: () => <span>eye-icon</span>,
  EyeOff: () => <span>eyeoff-icon</span>,
};
