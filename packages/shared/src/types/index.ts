export interface User {
  id: string;
  email: string;
  displayName: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export * from "./auth";
