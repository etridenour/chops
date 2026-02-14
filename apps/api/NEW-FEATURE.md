# Backend: Adding a New Feature

This guide walks through adding a new feature to the Express API. Follow these steps every time to keep the codebase consistent.

## Example: Adding a "Routines" Feature

### 1. Define the Prisma Model

Edit `prisma/schema.prisma` and add the model:

```prisma
model Routine {
  id          String   @id @default(cuid())
  name        String
  description String?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Then run:
```bash
pnpm db:migrate    # Create a migration
pnpm db:generate   # Regenerate the Prisma client
```

### 2. Add Shared Types (if applicable)

If the type is used by the frontend or mobile app, add it to `packages/shared/src/types/`:

```typescript
// packages/shared/src/types/routine.ts
export interface Routine {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

Export it from `packages/shared/src/types/index.ts` and `packages/shared/src/index.ts`.

### 3. Create the Controller

Create `src/controllers/routine.controller.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getRoutines = async (req: Request, res: Response) => {
  const routines = await prisma.routine.findMany();
  res.json(routines);
};

export const createRoutine = async (req: Request, res: Response) => {
  const routine = await prisma.routine.create({ data: req.body });
  res.status(201).json(routine);
};
```

### 4. Create the Route

Create `src/routes/routine.ts`:

```typescript
import { Router } from "express";
import { getRoutines, createRoutine } from "../controllers/routine.controller";

export const routineRouter = Router();

routineRouter.get("/", getRoutines);
routineRouter.post("/", createRoutine);
```

### 5. Register the Route

In `src/index.ts`, import and mount the router:

```typescript
import { routineRouter } from "./routes/routine";

app.use("/routines", routineRouter);
```

### 6. Test

```bash
# Health check
curl http://localhost:4000/health

# Create
curl -X POST http://localhost:4000/routines \
  -H "Content-Type: application/json" \
  -d '{"name": "Warm Up", "userId": "test-user-id"}'

# List
curl http://localhost:4000/routines
```

## File Naming Conventions

| Type | Location | Naming |
|------|----------|--------|
| Route | `src/routes/` | `feature-name.ts` (kebab-case) |
| Controller | `src/controllers/` | `feature-name.controller.ts` |
| Middleware | `src/middleware/` | `feature-name.middleware.ts` |
| Utility | `src/utils/` | `feature-name.util.ts` |
| Prisma model | `prisma/schema.prisma` | PascalCase model name |

## Checklist

- [ ] Prisma model added and migrated
- [ ] Shared types added to `packages/shared` (if used by frontend/mobile)
- [ ] Controller created with all CRUD operations needed
- [ ] Route created and registered in `src/index.ts`
- [ ] Tested manually with curl or Prisma Studio
