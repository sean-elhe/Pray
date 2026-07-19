import { useState } from "react";
import { createCategory } from "../api/categories";
import type { Category } from "../types";
import "./loginmodal.css";

type CategoryModalProps = {
  close: () => void;
  categories: Category[];
  selectedCategoryId: number | null;
  onSelect: (category: number | null) => void;
  onCreated: (category: Category) => void;
  onUpdated: (category: Category) => Promise<void>;
  onDeleted: (id: number) => Promise<void>;
};

export default function CategoryModal({
  close,
  categories,
  selectedCategoryId,
  onSelect,
  onCreated,
  onUpdated,
  onDeleted,
}: CategoryModalProps) {
  const [creating, setCreating] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#4D96FF");

  const [menuCategory, setMenuCategory] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const colors = [
    "#FF6B6B",
    "#FFB84C",
    "#FFD93D",
    "#6BCB77",
    "#4D96FF",
    "#845EC2",
    "#FF6F91",
  ];

  async function handleCreateCategory() {
    if (!categoryName.trim()) return;

    try {
      const category = await createCategory(categoryName, categoryColor);

      onCreated(category);

      setCategoryName("");
      setCategoryColor("#4D96FF");
      setCreating(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="category-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Categories</h2>
        <button
          onClick={() => {
            onSelect(null);
            close();
          }}
        >
          No Category
        </button>

        {!creating && !editingCategory && (
          <>
            {categories.map((category) => (
              <div key={category.id} className="category-row">
                <button
                  className={
                    selectedCategoryId === category.id
                      ? "category-button selected"
                      : "category-button"
                  }
                  onClick={() => {
                    onSelect(category.id);
                    close();
                  }}
                >
                  <span
                    className="category-dot"
                    style={{
                      backgroundColor: category.color,
                    }}
                  />

                  {category.name}
                </button>

                <button
                  className="category-menu-button"
                  onClick={() =>
                    setMenuCategory(
                      menuCategory?.id === category.id ? null : category,
                    )
                  }
                >
                  ⋮
                </button>
              </div>
            ))}

            {menuCategory && (
              <div className="category-actions">
                <button
                  onClick={() => {
                    setEditingCategory(menuCategory);
                    setMenuCategory(null);
                  }}
                >
                  Edit
                </button>

                <button
                  className="danger"
                  onClick={async () => {
                    try {
                      await onDeleted(menuCategory.id);
                      setMenuCategory(null);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            )}

            <hr />

            <button onClick={() => setCreating(true)}>+ New Category</button>
          </>
        )}

        {creating && (
          <>
            <h3>Create Category</h3>

            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
            />

            <div className="color-picker">
              {colors.map((color) => (
                <button
                  key={color}
                  className="color-circle"
                  style={{
                    backgroundColor: color,
                    border:
                      color === categoryColor ? "3px solid black" : "none",
                  }}
                  onClick={() => setCategoryColor(color)}
                />
              ))}
            </div>

            <button onClick={handleCreateCategory}>Create</button>

            <button
              onClick={() => {
                setCreating(false);
                setCategoryName("");
              }}
            >
              Cancel
            </button>
          </>
        )}

        {editingCategory && (
          <>
            <h3>Edit Category</h3>

            <input
              value={editingCategory.name}
              onChange={(e) =>
                setEditingCategory({
                  ...editingCategory,
                  name: e.target.value,
                })
              }
            />

            <div className="color-picker">
              {colors.map((color) => (
                <button
                  key={color}
                  className="color-circle"
                  style={{
                    backgroundColor: color,
                    border:
                      editingCategory.color === color
                        ? "3px solid black"
                        : "none",
                  }}
                  onClick={() =>
                    setEditingCategory({
                      ...editingCategory,
                      color,
                    })
                  }
                />
              ))}
            </div>

            <button
              onClick={async () => {
                await onUpdated(editingCategory);
                setEditingCategory(null);
              }}
            >
              Save
            </button>

            <button onClick={() => setEditingCategory(null)}>Back</button>
          </>
        )}
      </div>
    </div>
  );
}
