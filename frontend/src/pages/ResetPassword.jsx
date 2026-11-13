
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import logo from "../assets/saveliens_logo.png";
import styles from "./PasswordRecovery.module.css";

const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_BASE_URL;

const RESET_PASSWORD_URL =
  `${API_BASE_URL}/api/auth/reset-password`;

export default function ResetPassword() {
  const navigate = useNavigate();

  const [token] = useState(() => {
    return new URLSearchParams(
      window.location.search
    ).get("token") || "";
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname
      );
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError(
        "This password-reset link is invalid or missing."
      );
      return;
    }

    if (password.length < 12 || password.length > 128) {
      setError(
        "Password must contain 12 to 128 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(RESET_PASSWORD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          setError(
            "The reset link is invalid or expired, or the new password cannot be used. Request a new link or choose a different password."
          );
        } else if (response.status === 429) {
          setError(
            "Too many attempts. Please try again later."
          );
        } else {
          setError(
            "Unable to reset your password. Please try again."
          );
        }
        return;
      }

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");

      // The backend invalidates existing sessions.
      // Return to Sign In with the new password.
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgBlue} />

      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="Saveliens logo" />
        </Link>

        <Link
          to="/signin"
          className={styles.headerLink}
        >
          Sign In
        </Link>
      </header>

      <h1 className={styles.pageTitle}>
        Reset Password
      </h1>

      <main className={styles.main}>
        <div className={styles.card}>
          <section className={styles.formPanel}>
            <h2 className={styles.formTitle}>
              Create a new password
            </h2>

            <p className={styles.description}>
              Choose a secure password to regain
              access to your Saveliens account.
            </p>

            {success ? (
              <>
                <div
                  className={styles.success}
                  role="status"
                >
                  Your password has been reset
                  successfully. You can now sign in
                  using your new password.
                </div>

                <button
                  className={styles.button}
                  onClick={() =>
                    navigate("/signin", {
                      replace: true,
                      state: {
                        message:
                          "Password reset successful. Please sign in.",
                      },
                    })
                  }
                >
                  Continue to Sign In
                </button>
              </>
            ) : !token ? (
              <>
                <div
                  className={styles.error}
                  role="alert"
                >
                  This password-reset link is missing
                  or invalid.
                </div>

                <Link
                  to="/forgot-password"
                  className={styles.backLink}
                >
                  Request a new reset link
                </Link>
              </>
            ) : (
              <form
                onSubmit={handleSubmit}
                className={styles.form}
              >
                {error && (
                  <div
                    className={styles.error}
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <div className={styles.field}>
                  <label
                    htmlFor="new-password"
                    className={styles.label}
                  >
                    New password
                  </label>

                  <input
                    id="new-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    className={styles.input}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label
                    htmlFor="confirm-password"
                    className={styles.label}
                  >
                    Confirm password
                  </label>

                  <input
                    id="confirm-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    className={styles.input}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                    required
                  />
                </div>

                <label className={styles.label}>
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(event) =>
                      setShowPassword(
                        event.target.checked
                      )
                    }
                  />{" "}
                  Show passwords
                </label>

                <button
                  type="submit"
                  className={styles.button}
                  disabled={loading}
                >
                  {loading
                    ? "Resetting..."
                    : "Reset Password"}
                </button>
              </form>
            )}

            <Link
              to="/signin"
              className={styles.backLink}
            >
              ← Back to Sign In
            </Link>
          </section>

          <aside className={styles.promoPanel}>
            <div className={styles.promoContent}>
              <h2 className={styles.promoTitle}>
                Keep your saved links secure.
              </h2>

              <p className={styles.promoDescription}>
                Protect your account and continue
                organizing everything that matters.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
