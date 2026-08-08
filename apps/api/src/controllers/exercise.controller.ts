import {
  CreateExerciseRequest,
  parseExerciseQuery,
  UpdateExerciseRequest,
  validateCreateExercise,
  validateUpdateExercise,
} from "@chops/shared";
import { Request, Response, NextFunction } from "express";
import * as exerciseService from "../services/exercise.service";

// POST /exercises
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const exercise = req.body as CreateExerciseRequest;
    const userId = (req as any).user?.sub;
    const errors = validateCreateExercise(exercise);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0] });
    }

    const result = await exerciseService.createExercise(userId, exercise);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// GET /exercises
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = parseExerciseQuery(req.query);
    if (!response.ok) {
      return res.status(400).json({ message: response.errors[0] });
    }
    const userId = (req as any).user?.sub;
    const result = await exerciseService.getExercises(userId, response.data);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// GET /exercises/:id
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.sub;

    const result = await exerciseService.getExerciseById(userId, req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// PUT /exercises/:id
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const exercise = req.body as UpdateExerciseRequest;
    const userId = (req as any).user?.sub;
    const errors = validateUpdateExercise(exercise);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0] });
    }

    const result = await exerciseService.updateExercise(
      userId,
      req.params.id,
      exercise,
    );
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// DELETE /exercises/:id
export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.sub;

    await exerciseService.deleteExercise(userId, req.params.id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// GET /exercises/tags
export const getTags = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.sub;
    const result = await exerciseService.getTags(userId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
