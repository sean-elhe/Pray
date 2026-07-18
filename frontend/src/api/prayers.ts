import { api } from "./client";
import type { Prayer } from "../types";

export async function createPrayer(
  content: string,
  is_public: boolean,
  category_id: number | null,
) {
  return api("/api/prayers", {
    method: "POST",
    body: JSON.stringify({
      content,
      is_public,
      category_id,
    }),
  });
}

export async function fetchSavedPrayers(): Promise<Prayer[]> {
  return api("/api/prayers");
}

export async function fetchSharedPrayers(): Promise<Prayer[]> {
  return api("/api/prayers/shared");
}

export async function fetchPublicPrayers(): Promise<Prayer[]> {
  return api("/api/prayers/public");
}

export async function removePrayer(id: number) {
  return api(`/api/prayers/${id}`, {
    method: "DELETE",
  });
}

export async function editPrayer(
  id: number,
  content: string,
  is_public: boolean,
) {
  return api(`/api/prayers/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      content,
      is_public,
    }),
  });
}
