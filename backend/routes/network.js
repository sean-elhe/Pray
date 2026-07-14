import express from "express";
import {
  sharePrayer,
  createShareLink,
  updateVisibility,
  searchUsers,
} from "../controllers/networkControllers.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/:id/share", auth, sharePrayer);

router.post("/:id/share-link", auth, createShareLink);
router.patch("/:id/visibility", auth, updateVisibility);
router.get("/search", auth, searchUsers);

export default router;
