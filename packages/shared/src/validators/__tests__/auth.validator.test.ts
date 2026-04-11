/**
 * Unit tests for auth validators.
 *
 * WHAT THIS FILE DOES:
 * Tests the validateLogin function — a pure function that takes an object
 * with email and password, and returns an array of error messages.
 * Empty array = valid input. Non-empty array = invalid input.
 *
 * WHY THIS IS EASY TO TEST:
 * Pure functions (same input always produces same output, no side effects)
 * are the simplest things to test. No mocking, no DOM, no setup needed.
 * Just: call the function, check the result.
 *
 * KEY CONCEPTS:
 * - describe(): Groups related tests together. Think of it like a folder.
 * - test() or it(): A single test case. "it should..." reads like English.
 * - expect(): Makes an assertion — "I expect this value to equal that value."
 *   If the assertion fails, the test fails.
 */

import { describe, test, expect } from "vitest";
import {
  validateLogin,
  validateResetPassword,
} from "../../validators/auth.validator";

// describe() groups tests for a specific function or feature.
// You can nest describe() blocks for sub-groups.
describe("validateLogin", () => {
  // --- HAPPY PATH ---
  // Always start with the simplest case: valid input should pass.

  test("returns empty array for valid email and password", () => {
    // Call the function with valid input
    const errors = validateLogin({
      email: "user@example.com",
      password: "mypassword123",
    });

    // Assert: empty array means no validation errors
    expect(errors).toEqual([]);
    // toEqual() does a deep comparison — checks that the array is empty.
    // toBe() checks reference equality (same object in memory).
    // For arrays/objects, always use toEqual(). For strings/numbers, toBe() works.
  });

  // --- SAD PATHS ---
  // Test each way the input can be invalid.

  test("returns error when email is empty", () => {
    const errors = validateLogin({ email: "", password: "mypassword123" });

    // We expect at least one error
    expect(errors.length).toBeGreaterThan(0);

    // We can also check what the error message says.
    // Using .toLowerCase() so we're not fragile about capitalization.
    expect(errors[0].toLowerCase()).toContain("email");
  });

  test("returns error when email is not a valid email format", () => {
    const errors = validateLogin({
      email: "not-an-email",
      password: "mypassword123",
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].toLowerCase()).toContain("email");
  });

  test("returns error when password is empty", () => {
    const errors = validateLogin({ email: "user@example.com", password: "" });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].toLowerCase()).toContain("password");
  });

  test("returns error when both fields are empty", () => {
    const errors = validateLogin({ email: "", password: "" });

    // At least one error — we don't care about the exact count,
    // just that validation caught the problem.
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe("validate reset password", () => {
  test("password valid", () => {
    const errors = validateResetPassword({
      token: "validtoken",
      password: "validPassword123",
      confirmPassword: "validPassword123",
    });

    expect(errors).toEqual([]);
  });

  test("password must be min of 8 characters", () => {
    const errors = validateResetPassword({
      token: "validtoken",
      password: "short",
      confirmPassword: "short",
    });

    expect(errors[0].toLowerCase()).toContain("password");
  });

  test("confirm password must match password", () => {
    const errors = validateResetPassword({
      token: "validtoken",
      password: "validpassword",
      confirmPassword: "differentpassword",
    });

    expect(errors[0].toLowerCase()).toContain("match");
  });

  test("missing reset password token", () => {
    const errors = validateResetPassword({
      token: "",
      password: "validpassword",
      confirmPassword: "validpassword",
    });

    expect(errors[0].toLowerCase()).toContain("token");
  });
});
