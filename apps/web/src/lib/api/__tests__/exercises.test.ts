import { beforeEach, describe, expect, test, vi } from "vitest";
import { fetchExercises } from "../exercises";
import { apiClient } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(apiClient).mockReset();
  vi.mocked(apiClient).mockResolvedValue({
    ok: true,
    json: async () => ({ items: [], total: 0 }),
  } as unknown as Response);
});

describe("fetchExercises", () => {
  test("no args no params", async () => {
    await fetchExercises({});

    expect(vi.mocked(apiClient)).toHaveBeenCalledWith("/exercises");
  });

  test("page and pageSize show correctly in params", async () => {
    await fetchExercises({ page: 2, pageSize: 10 });

    expect(vi.mocked(apiClient)).toHaveBeenCalledWith(
      "/exercises?page=2&pageSize=10",
    );
  });

  test("empty search, tags, difficulty shows empty in params", async () => {
    await fetchExercises({ search: "", tags: [], difficulty: [] });

    expect(vi.mocked(apiClient)).toHaveBeenCalledWith("/exercises");
  });

  test("search value is url encoded", async () => {
    await fetchExercises({ search: "test search" });

    expect(vi.mocked(apiClient)).toHaveBeenCalledWith(
      "/exercises?search=test+search",
    );
  });

  test("arrays split properly for the params", async () => {
    await fetchExercises({ tags: ["tag1", "tag2"], difficulty: [2, 3] });

    expect(vi.mocked(apiClient)).toHaveBeenCalledWith(
      "/exercises?tags=tag1%2Ctag2&difficulty=2%2C3",
    );
  });

  test("ok: false throws Api's message", async () => {
    vi.mocked(apiClient).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Nope" }),
    } as unknown as Response);

    await expect(fetchExercises({})).rejects.toThrow("Nope");
  });

  test("returns correct json format", async () => {
    const payload = {
      items: [{ id: "1", title: "Paradiddle" }],
      total: 1,
      page: 1,
      pageSize: 20,
    };

    vi.mocked(apiClient).mockResolvedValue({
      ok: true,
      json: async () => payload,
    } as unknown as Response);

    const result = await fetchExercises({});

    expect(result).toEqual(payload);
  });
});
