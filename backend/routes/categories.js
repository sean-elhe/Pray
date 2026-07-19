import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoriesController.js";
import { auth } from "../middleware/auth.js";
import { updatePrayerCategory } from "../controllers/prayersController.js";

const router = express.Router();

router.post("/", auth, createCategory);
router.get("/", auth, getCategories);
router.patch("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);
router.patch("/:id/category", auth, updatePrayerCategory);

export default router;
