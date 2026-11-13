
import { useState } from "react";
import { Link } from "react-router";
import logo from "../assets/saveliens_logo.png";
import styles from "./PasswordRecovery.module.css";

const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_BASE_URL;

const FORGOT_PASSWORD_URL =
  `${API_BASE_URL}/api/auth/forgot-password`;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(FORGOT_PASSWORD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        return;
      }

      if (response.status === 429) {
        setError(
          "Too many requests. Please wait before trying again."
        );
        return;
      }

      setError(
        "Unable to process your request. Please try again later."
      );
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

        <Link to="/signin" className={styles.headerLink}>
          Sign In
        </Link>
      </header>

      <h1 className={styles.pageTitle}>
        Forgot Password
      </h1>

      <main className={styles.main}>
        <div className={styles.card}>
          <section className={styles.formPanel}>
            <h2 className={styles.formTitle}>
              Reset your password
            </h2>

            <p className={styles.description}>
              Enter your registered email address.
              If your account supports password login,
              we'll send you a link to reset your password.
            </p>

            {success ? (
              <div className={styles.success} role="status">
                If an eligible account exists for this
                email, a password-reset link will be
                sent shortly. Please check your inbox
                and spam folder.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className={styles.form}
                noValidate
              >
                {error && (
                  <div className={styles.error} role="alert">
                    {error}
                  </div>
                )}

                <div className={styles.field}>
                  <label
                    htmlFor="reset-email"
                    className={styles.label}
                  >
                    Email address
                  </label>

                  <input
                    id="reset-email"
                    type="email"
                    className={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles.button}
                  disabled={loading}
                >
                  {loading
                    ? "Sending..."
                    : "Send Reset Link"}
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
                Your resources, always within reach.
              </h2>

              <p className={styles.promoDescription}>
                Recover access to your organized
                links, topics, and saved resources.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
