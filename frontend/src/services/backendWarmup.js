const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let warmupPromise = null;

export function warmupBackend() {
  if (!BASE_URL) {
    console.warn("Backend URL is not configured");
    return Promise.resolve(false);
  }

  if (warmupPromise) {
    return warmupPromise;
  }

  warmupPromise = fetch(
    `${BASE_URL.replace(/\/$/, "")}/api/health`,
    {
      method: "GET",
      cache: "no-store",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      return true;
    })
    .catch((error) => {
      console.warn("Backend warm-up failed:", error.message);
      return false;
    })
    .finally(() => {
      warmupPromise = null;
    });

  return warmupPromise;
}