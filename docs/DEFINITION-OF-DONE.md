# Definition of Done

Every chunk of work is checked against this list before it is handed off for review. Not every item applies to every chunk. Mark what doesn't apply as N/A instead of skipping it silently.

## Tests

- [ ] Pure logic (metronome math, tempo ramps, streaks) has unit tests covering edge cases
- [ ] API services have tests for business rules, including ownership ("a user can't touch someone else's data")
- [ ] Components have tests for render, interaction, error state, and empty state
- [ ] Tests query by role and accessible name, not test IDs or class names
- [ ] Each user journey has a Playwright spec for the happy path and the main failure path
- [ ] Every bug fix ships with a test that failed before the fix

## Accessibility (WCAG 2.2 AA)

- [ ] Everything works by keyboard alone, with a visible focus indicator
- [ ] Every input has a label; errors are tied to their field and announced
- [ ] Icon-only buttons and menus have accessible names
- [ ] Landmarks (header, nav, main) and heading order are correct
- [ ] Text contrast is at least 4.5:1; color is never the only signal
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Touch targets are at least 44pt on mobile
- [ ] Async changes (saved, loading, errors) are announced to screen readers
- [ ] New screens are checked with VoiceOver on web and iOS
- [ ] Metronome visuals never flash more than 3 times per second over a large area (WCAG 2.3.1)

## UX Patterns

- [ ] Every data view has loading, empty, error, and success states
- [ ] Loading indicators are delayed to avoid flicker (`useDelayedLoading`)
- [ ] Every action gives clear feedback
- [ ] Destructive actions confirm or offer undo
- [ ] Forms keep input on error, and Enter submits
- [ ] Filters and navigation state live in the URL; the back button works
- [ ] Layout is mobile-first and holds up at 320px wide
- [ ] A network drop never loses the user's work
- [ ] During practice: large controls, screen stays awake, minimal taps

## Component Structure

- [ ] Shared UI lives in `@chops/ui`; app-only UI stays in the app
- [ ] Only `@chops/ui` tokens; no hardcoded colors, spacing, or font sizes
- [ ] Each component does one job; split when it has two reasons to change
- [ ] Data fetching lives in hooks; components render
- [ ] Logic that doesn't need React lives in plain functions
- [ ] Shared pieces are extracted on the third use, not the first

## API

- [ ] Routes → thin controllers → services → Prisma
- [ ] Every input is validated with `@chops/shared` validators
- [ ] Every query is scoped to the data the user owns
- [ ] Errors go through `AppError` with one consistent shape; no stack traces leak
- [ ] Lists are paginated; filtered fields are indexed

## Security

- [ ] No secrets in code
- [ ] Auth routes are rate limited
- [ ] New dependencies and hosting choices get a quick security check

## Performance

- [ ] The player and metronome don't re-render on every beat
- [ ] Audio scheduling stays off the React render path
- [ ] Heavy libraries need a stated reason

## Maintainability

- [ ] Names are clear enough that comments aren't needed
- [ ] One commit tells one story
- [ ] `pnpm check` passes with zero errors
- [ ] Changes to `@chops/ui` are verified on web and mobile
- [ ] New patterns are noted in the relevant `CLAUDE.md`
- [ ] No dead code; every TODO has a BACKLOG entry
