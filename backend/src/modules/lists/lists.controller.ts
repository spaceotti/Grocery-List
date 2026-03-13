import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/AppError";
import { catchAsync } from "../../shared/utils/catchAsync";
import {
  createList,
  getListsByOwner,
  getListByIdForOwner,
  updateListForOwner,
  deleteListForOwner,
  addItemToListForOwner,
  updateItemInListForOwner,
  removeItemFromListForOwner,
} from "./lists.service";
import {
  createListSchema,
  updateListSchema,
  createItemSchema,
  updateItemSchema,
} from "./lists.validation";

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

//6. Add a new item to one specific list for the authenticated user
export const addItem = catchAsync(async (req: Request, res: Response) => {
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
  //Validate the request body with Zod
  const parsed = createItemSchema.parse(req.body);
  //Delegate business logic to the service layer
  const item = await addItemToListForOwner({
    listId,
    ownerId: req.user.id,
    name: parsed.name,
  });
  //Return created item
  res.status(201).json({
    item,
  });
});

//7. Update item of one specific list for the authenticated user
export const updateItem = catchAsync(async (req: Request, res: Response) => {
  //requireAuth should already have attached req.user
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }
  //Read params
  const { listId, itemId } = req.params;
  //Validate params before passing them it to the service
  if (!listId || Array.isArray(listId)) {
    throw new AppError("Invalid list id", 400);
  }
  if (!itemId || Array.isArray(itemId)) {
    throw new AppError("Invalid item id", 400);
  }
  //Validate req.body with Zod
  const parsed = updateItemSchema.parse(req.body);
  //Delegate update logic to the service layer
  const item = await updateItemInListForOwner({
    listId,
    itemId,
    ownerId: req.user.id,
    name: parsed.name,
    checked: parsed.checked,
  });
  //Return updated item
  res.status(200).json({
    item,
  });
});

//8. Remove one specific item from one specific list of the authenticated user
export const removeItem = catchAsync(async (req: Request, res: Response) => {
  //requireAuth should already have attached req.user
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }
  //Read params
  const { listId, itemId } = req.params;
  //Validate route params before passing them to the service layer
  if (!listId || Array.isArray(listId)) {
    throw new AppError("Invalid list id", 400);
  }
  if (!itemId || Array.isArray(itemId)) {
    throw new AppError("Invalid item id", 400);
  }
  //Delegate delete logic to the service layer
  const result = await removeItemFromListForOwner({
    listId,
    itemId,
    ownerId: req.user.id,
  });
  //Return a success message
  res.status(200).json(result);
});
