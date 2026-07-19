import { api } from "./client";
import type { Category } from "../types";

export async function getCategories(): Promise<Category[]> {
  return api("/api/categories");
}

export async function createCategory(
  name: string,
  color: string,
): Promise<Category> {
  return api("/api/categories", {
    method: "POST",
    body: JSON.stringify({
      name,
      color,
    }),
  });
}

export async function updateCategory(id: number, name: string, color: string) {
  return api(`/api/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name,
      color,
    }),
  });
}

export async function deleteCategory(id: number) {
  return api(`/api/categories/${id}`, {
    method: "DELETE",
  });
}

export async function changePrayerCategory(
  prayerId: number,
  categoryId: number | null,
) {
  return api(`/api/prayers/${prayerId}/category`, {
    method: "PATCH",
    body: JSON.stringify({
      category_id: categoryId,
    }),
  });
}
