import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { me } from "./users.controller";

const router = Router();

router.get("/me", requireAuth, me);

export default router;
