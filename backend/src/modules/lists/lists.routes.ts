import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { create, getMine, getList, update, remove } from "./lists.controller";

const router = Router();

router.use(requireAuth);

router.route("/").post(create).get(getMine);
router.route("/:listId").get(getList).patch(update).delete(remove);

export default router;
