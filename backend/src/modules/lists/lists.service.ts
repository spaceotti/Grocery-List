import mongoose from "mongoose";
import { ListModel } from "./list.model";
import { AppError } from "../../shared/errors/AppError";

//1. Create new list for authenticated user
export async function createList(input: { name: string; ownerId: string }) {
  const list = await ListModel.create({
    name: input.name,
    owner: input.ownerId,
  });

  return list;
}
//2. Get all lists belonging to one authenticated user. Filter by ownerId -> only own lists available
export async function getListsByOwner(ownerId: string) {
  const lists = await ListModel.find({ owner: ownerId }).sort({
    createdAt: -1,
  });

  return lists;
}
//3. Get one specific list that belongs to the authenticated user. Search by both: list id, owner id
export async function getListByIdForOwner(input: {
  listId: string;
  ownerId: string;
}) {
  //Safety check before querying
  if (!mongoose.Types.ObjectId.isValid(input.listId)) {
    throw new AppError("Invalid list id", 400);
  }

  const list = await ListModel.findOne({
    _id: input.listId,
    owner: input.ownerId,
  });

  if (!list) {
    throw new AppError("List not found", 404);
  }

  return list;
}

//4. Update the name of a list that belongs to the authenticated user.
export async function updateListForOwner(input: {
  listId: string;
  ownerId: string;
  name: string;
}) {
  //Safety check before querying
  if (!mongoose.Types.ObjectId.isValid(input.listId)) {
    throw new AppError("Invalid list id", 400);
  }

  const list = await ListModel.findOneAndUpdate(
    {
      _id: input.listId,
      owner: input.ownerId,
    },
    {
      name: input.name,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!list) {
    throw new AppError("List not found", 404);
  }

  return list;
}

//5. Delete a list that belongs to the authenticated user.
export async function deleteListForOwner(input: {
  listId: string;
  ownerId: string;
}) {
  //Safety check before querying
  if (!mongoose.Types.ObjectId.isValid(input.listId)) {
    throw new AppError("Invalid list id", 400);
  }

  const list = await ListModel.findOneAndDelete({
    _id: input.listId,
    owner: input.ownerId,
  });

  if (!list) {
    throw new AppError("List not found", 404);
  }

  return {
    message: "List deleted successfully",
  };
}
