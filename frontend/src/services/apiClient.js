
const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_BASE_URL;

let refreshPromise = null;
let refreshController = null;
let sessionGeneration = 0;
let logoutInProgress = false;

export class AuthenticationError extends Error {
  constructor(message = "Your session has expired.") {
    super(message);
    this.name = "AuthenticationError";
  }
}

function assertActiveSession(generation) {
  if (
    logoutInProgress ||
    generation !== sessionGeneration
  ) {
    throw new AuthenticationError(
      "This session is no longer active."
    );
  }
}

/**
 * Invalidates the current frontend session immediately.
 * Call this before sending a logout request.
 */
export function invalidateSession() {
  logoutInProgress = true;
  sessionGeneration += 1;

  if (refreshController) {
    refreshController.abort();
  }

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userEmail");

  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
}

/**
 * Called after a successful login.
 * Enables requests for the newly authenticated session.
 */
export function activateSession(token, email) {
  sessionGeneration += 1;
  logoutInProgress = false;

  sessionStorage.setItem("token", token);

  if (email) {
    sessionStorage.setItem("userEmail", email);
  } else {
    sessionStorage.removeItem("userEmail");
  }
}

export async function refreshAccessToken() {
  if (logoutInProgress) {
    throw new AuthenticationError(
      "You have signed out."
    );
  }

  if (!refreshPromise) {
    const generation = sessionGeneration;
    const controller = new AbortController();

    refreshController = controller;

    const operation = (async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
            signal: controller.signal,
          }
        );

        assertActiveSession(generation);

        if (response.status === 401) {
          sessionStorage.removeItem("token");
          throw new AuthenticationError();
        }

        if (!response.ok) {
          throw new Error(
            `Token refresh failed: ${response.status}`
          );
        }

        const data = await response.json();

        assertActiveSession(generation);

        if (!data.accessToken) {
          throw new Error(
            "Refresh response is missing an access token."
          );
        }

        sessionStorage.setItem(
          "token",
          data.accessToken
        );

        return data.accessToken;
      } catch (error) {
        assertActiveSession(generation);
        throw error;
      }
    })();

    const sharedPromise = operation.finally(() => {
      if (refreshPromise === sharedPromise) {
        refreshPromise = null;
        refreshController = null;
      }
    });

    refreshPromise = sharedPromise;
  }

  return refreshPromise;
}

export async function apiFetch(endpoint, options = {}) {
  const generation = sessionGeneration;

  assertActiveSession(generation);

  const headers = new Headers(options.headers);
  const token = sessionStorage.getItem("token");

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const request = () =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

  let response = await request();

  assertActiveSession(generation);

  if (response.status !== 401) {
    return response;
  }

  if (endpoint.startsWith("/api/auth/")) {
    return response;
  }

  const newToken = await refreshAccessToken();

  assertActiveSession(generation);

  headers.set(
    "Authorization",
    `Bearer ${newToken}`
  );

  response = await request();

  assertActiveSession(generation);

  if (response.status === 401) {
    sessionStorage.removeItem("token");
    throw new AuthenticationError();
  }

  return response;
}
