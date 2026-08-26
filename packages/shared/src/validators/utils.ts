// Extracts error messages from a Zod safeParse result.
// Returns an empty array if validation passed.
export function extractErrors(result: { success: boolean; error?: any }): string[] {
  if (result.success) return [];
  return result.error.issues.map((issue: any) => issue.message);
}
