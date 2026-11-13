import { apiFetch } from "./apiClient";

export async function suggestLinkCategory(url, signal) {
  const response = await apiFetch("/api/ai/links/suggest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url.trim() }),
    signal,
  });

  if (!response.ok) {
    if (response.status === 422) {
      throw new Error("Please enter a valid URL.");
    }

    if (response.status === 429) {
      throw new Error(
        "AI suggestions are temporarily limited. You can select a topic manually."
      );
    }

    throw new Error(
      "Unable to generate an AI suggestion. Please try again."
    );
  }

  return response.json();
}