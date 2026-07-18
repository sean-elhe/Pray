import pool from "../db.js";

export const createCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name required" });
    }

    const result = await pool.query(
      `
            INSERT INTO categories (user_id, name, color)
            VALUES ($1, $2, $3)
            RETURNING *;
            `,
      [userId, name, color || "#808080"],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Create category error:", err);

    if (err.code === "23505") {
      return res.status(409).json({
        error: "Category already exists",
      });
    }

    res.status(500).json({
      error: "Database error",
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
            SELECT id, name, color
            FROM categories
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
      [userId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET categories error:", err);
    res.status(500).json({ error: "Database error " });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, color } = req.body;

    const result = await pool.query(
      `
            UPDATE categories
            SET name = $1,
                color = $2
            WHERE id = $3
            AND user_id = $4
            RETURNING *;
            `,
      [name, color, id, userId],
    );

    if (!name?.trim()) {
      return res.status(400).json({
        error: "Category name required",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Database error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `
            DELETE FROM categories
            WHERE id = $1
            AND user_id = $2
            RETURNING id;
            `,
      [id, userId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Category not found",
      });
    }

    res.json({
      message: "Category deleted",
    });
  } catch (err) {
    console.error("DELETE /categories error:", err);
    res.status(500).json({
      error: "Database error",
    });
  }
};
