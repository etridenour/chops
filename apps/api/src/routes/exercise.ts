import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  create,
  getAll,
  getById,
  remove,
  update,
  getTags,
} from "../controllers/exercise.controller";

export const exerciseRouter: Router = Router();

exerciseRouter.post("/", requireAuth, create);
exerciseRouter.get("/", requireAuth, getAll);
exerciseRouter.get("/tags", requireAuth, getTags);
exerciseRouter.get("/:id", requireAuth, getById);
exerciseRouter.put("/:id", requireAuth, update);
exerciseRouter.delete("/:id", requireAuth, remove);
