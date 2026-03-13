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

//6. Add a new item to one specific list of the authenticated user
export async function addItemToListForOwner(input: {
  listId: string;
  ownerId: string;
  name: string;
}) {
  //Validate listId before querying MongoDB
  if (!mongoose.Types.ObjectId.isValid(input.listId)) {
    throw new AppError("Invalid list id", 400);
  }
  //Find the list that matches both: listId, ownerId
  const list = await ListModel.findOne({
    _id: input.listId,
    owner: input.ownerId,
  });
  if (!list) {
    throw new AppError("List not found", 404);
  }
  //Push a new item into the embedded items array
  list.items.push({
    name: input.name,
  });
  //Save updated list document
  await list.save();
  //Return created item
  const newItem = list.items[list.items.length - 1];
  return newItem;
}

//7. Update item of one specific list of the authenticated user
export async function updateItemInListForOwner(input: {
  listId: string;
  itemId: string;
  ownerId: string;
  name?: string;
  checked?: boolean;
}) {
  //Validate both Mongo ids before querying
  if (!mongoose.Types.ObjectId.isValid(input.listId)) {
    throw new AppError("Invalid list id", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(input.itemId)) {
    throw new AppError("Invalid item id", 400);
  }
  //Find the list that matches both: listId, ownerId
  const list = await ListModel.findOne({
    _id: input.listId,
    owner: input.ownerId,
  });
  if (!list) {
    throw new AppError("List not found", 404);
  }
  //Find the embedded item inside the list
  const item = list.items.id(input.itemId);
  //If no embedded item with this id exists
  if (!item) {
    throw new AppError("Item not found", 404);
  }
  //Update only the fields that were actually provided
  if (input.name !== undefined) {
    item.name = input.name;
  }

  if (input.checked !== undefined) {
    item.checked = input.checked;
  }
  //Save the parent document so the embedded item changes persist
  await list.save();
  //Return the updated embedded item
  return item;
}

//8. Remove item from one specific list of the authenticated user
export async function removeItemFromListForOwner(input: {
  listId: string;
  itemId: string;
  ownerId: string;
}) {
  //Validate both Mongo ids before querying
  if (!mongoose.Types.ObjectId.isValid(input.listId)) {
    throw new AppError("Invalid list id", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(input.itemId)) {
    throw new AppError("Invalid item id", 400);
  }
  //Find the list that matches both: listId, ownerId
  const list = await ListModel.findOne({
    _id: input.listId,
    owner: input.ownerId,
  });
  if (!list) {
    throw new AppError("List not found", 404);
  }
  //Find the embedded item inside the list
  const item = list.items.id(input.itemId);
  //If no embedded item with this id exists
  if (!item) {
    throw new AppError("Item not found", 404);
  }
  //Remove the embedded item from the document array
  item.deleteOne();
  //Save the updated parent document
  await list.save();
  //Return
  return {
    message: "Item deleted successfully",
  };
}
