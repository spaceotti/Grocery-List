import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import {
  create,
  getMine,
  getList,
  update,
  remove,
  addItem,
  updateItem,
  removeItem,
} from "./lists.controller";

const listsRouter = Router();

//Protect all list routes
listsRouter.use(requireAuth);

//List routes
listsRouter.route("/").post(create).get(getMine);
listsRouter.route("/:listId").get(getList).patch(update).delete(remove);

//Item routes inside the list
listsRouter.route("/:listId/items").post(addItem);
listsRouter
  .route("/:listId/items/:itemId")
  .patch(updateItem)
  .delete(removeItem);

export default listsRouter;
