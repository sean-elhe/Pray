import express from "express";
import {
  getPrayers,
  createPrayer,
  updatePrayer,
  deletePrayer,
} from "../controllers/prayersController.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getPrayers);
router.post("/", auth, createPrayer);
router.patch("/:id", auth, updatePrayer);
router.delete("/:id", auth, deletePrayer);

export default router;
