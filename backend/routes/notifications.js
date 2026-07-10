import express from "express";
import {
  getNotifications,
  markRead,
} from "../controllers/notificationsController.js";
import { auth } from "../middleware/auth.js";

console.log("notifications route loaded");

const router = express.Router();

router.get("/", auth, getNotifications);
router.patch("/:id/read", auth, markRead);

export default router;
