import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useDelayedLoading } from "../use-delayed-loading";

describe("useDelayedLoading", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("stays false when loading ends before the delay", () => {
    const { result, rerender } = renderHook(
      ({ isLoading }) => useDelayedLoading(isLoading, 200),
      { initialProps: { isLoading: true } },
    );

    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe(false);

    rerender({ isLoading: false });

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(false);
  });

  test("turns true after the timer is up", () => {
    const { result } = renderHook(
      ({ isLoading }) => useDelayedLoading(isLoading, 200),
      { initialProps: { isLoading: true } },
    );

    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe(true);
  });

  test("turns false immediately after loading false", () => {
    const { result, rerender } = renderHook(
      ({ isLoading }) => useDelayedLoading(isLoading, 200),
      { initialProps: { isLoading: true } },
    );

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe(true);

    rerender({ isLoading: false });

    expect(result.current).toBe(false);
  });
});
