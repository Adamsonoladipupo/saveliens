
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { activateSession } from "../services/apiClient";

const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_BASE_URL;

export default function OAuthCallback() {
  const navigate = useNavigate();
  const started = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // Remove the one-time code from the browser URL.
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname
    );

    if (!code) {
      setError("Missing OAuth authorization code.");
      return;
    }

    async function completeLogin() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/oauth/exchange`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.token) {
          throw new Error(
            data.message ||
              "Google authentication failed."
          );
        }

        // sessionStorage.setItem("token", data.token);
        // sessionStorage.setItem("userEmail", data.email);
        activateSession(data.token, data.email);

        navigate("/dashboard", { replace: true });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Google authentication failed."
        );
      }
    }

    completeLogin();
  }, [navigate]);

  if (error) {
    return (
      <main style={{ padding: "40px", textAlign: "center" }}>
        <h2>Google sign-in failed</h2>
        <p>{error}</p>
        <a href="/signin">Return to Sign In</a>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h2>Completing Google authentication...</h2>
      <p>Please wait while we sign you in.</p>
    </main>
  );
}
