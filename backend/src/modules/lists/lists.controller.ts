import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/AppError";
import { catchAsync } from "../../shared/utils/catchAsync";
import {
  createList,
  getListsByOwner,
  getListByIdForOwner,
  updateListForOwner,
  deleteListForOwner,
} from "./lists.service";
import { createListSchema, updateListSchema } from "./lists.validation";

//1. Create a new grocery list for the authenticated user
export const create = catchAsync(async (req: Request, res: Response) => {
  //requireAuth should have attached req.user, if not request is unautorized
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }
  //Validate request body using Zod
  const parsed = createListSchema.parse(req.body);
  //Delegate business logic to the service layer. Owner from authenticated user, never from req.body!!!
  const list = await createList({
    name: parsed.name,
    ownerId: req.user.id,
  });
  //Return created list
  res.status(201).json({
    list,
  });
});
//2. Get all lists for the authenticated user
export const getMine = catchAsync(async (req: Request, res: Response) => {
  //requireAuth should have attached req.user, if not request is unautorized
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }
  //Delegate business logic to service layer
  const lists = await getListsByOwner(req.user.id);
  //Return lists
  res.status(200).json({
    results: lists.length,
    lists,
  });
});
//3. Get one specific list for the authenticated user.
export const getList = catchAsync(async (req: Request, res: Response) => {
  //requireAuth should have attached req.user, if not request is unautorized
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }
  //Delegate business logic to service layer. listId comes from URL params
  const { listId } = req.params;

  if (!listId || Array.isArray(listId)) {
    throw new AppError("Invalid list id", 400);
  }

  const list = await getListByIdForOwner({
    listId,
    ownerId: req.user.id,
  });
  //Return list
  res.status(200).json({
    list,
  });
});
// 4. Update the name of one specific list for the authenticated user
export const update = catchAsync(async (req: Request, res: Response) => {
  //requireAuth should have attached req.user, if not request is unautorized
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }
  //Read listId from the route params.
  const { listId } = req.params;

  // Validate that listId exists before calling the service.
  if (!listId || Array.isArray(listId)) {
    throw new AppError("Invalid list id", 400);
  }
  //Validate the request body with Zod.
  const parsed = updateListSchema.parse(req.body);
  //Delegate update logic to the service layer. - Own list can only be updated.
  const list = await updateListForOwner({
    listId,
    ownerId: req.user.id,
    name: parsed.name,
  });
  //Return the updated list
  res.status(200).json({
    list,
  });
});
//5. Delete one specific list for the authenticated user
export const remove = catchAsync(async (req: Request, res: Response) => {
  //Ensure the request is authenticated.
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  //Read the list id from the route params.
  const { listId } = req.params;

  //Validate the route param before passing it to the service.
  if (!listId || Array.isArray(listId)) {
    throw new AppError("Invalid list id", 400);
  }
  //Delegate update logic to the service layer. - Own list can only be deleted.
  const result = await deleteListForOwner({
    listId,
    ownerId: req.user.id,
  });

  // Return a success message.
  res.status(200).json(result);
});
