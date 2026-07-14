import express from "express";
import {
  getPrayers,
  getPublicPrayers,
  createPrayer,
  updatePrayer,
  deletePrayer,
  getSharedPrayers,
} from "../controllers/prayersController.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/shared", auth, getSharedPrayers);
router.get("/", auth, getPrayers);
router.post("/", auth, createPrayer);
router.patch("/:id", auth, updatePrayer);
router.delete("/:id", auth, deletePrayer);
router.get("/public", getPublicPrayers);

export default router;
