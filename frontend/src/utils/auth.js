
import { invalidateSession } from "../services/apiClient";

const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_BASE_URL;

export async function logout() {
  // Invalidate frontend credentials before awaiting
  // any network request.
  invalidateSession();

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      console.error(
        `Logout request failed: ${response.status}`
      );
    }
  } catch (error) {
    console.error(
      "Logout request failed:",
      error
    );
  } finally {
    window.location.replace("/signin");
  }
}
