const BASE_URL = import.meta.env.VITE_API_URL || "";

export async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(BASE_URL + path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  console.log(BASE_URL);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}
