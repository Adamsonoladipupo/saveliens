
import { useEffect, useState } from "react";
import styles from "./SignIn.module.css";
import { Link, useNavigate, useLocation } from "react-router";
import logo from "../assets/saveliens_logo.png";

import { activateSession } from "../services/apiClient";

const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_BASE_URL;

const USERS_URL = `${API_BASE_URL}/api/users`;

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const justRegistered = location.state?.registered === true;

  const passwordChangeMessage = location.state?.message;

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("oauth_error") === "failed") {
      setApiError(
        "Google authentication failed. Please try again."
      );
    }
  }, [location.search]);

  const validate = () => {
    const errs = {};

    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      errs.email = "Enter a valid email address.";
    }

    if (!form.password) {
      errs.password = "Password is required.";
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (apiError) {
      setApiError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${USERS_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        // sessionStorage.setItem("token", data.token);
        // sessionStorage.setItem("userEmail", data.email);
        activateSession(data.token, data.email);

        navigate("/dashboard", { replace: true });
        return;
      }

      const data = await res.json().catch(() => null);

      setApiError(
        data?.message ||
          (res.status === 401
            ? "Incorrect email or password."
            : res.status === 404
              ? "No account found with this email."
              : "Something went wrong. Please try again.")
      );
    } catch (error) {
      console.error("Login failed:", error);

      setApiError(
        "Unable to connect to the server. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setApiError("");

    window.location.assign(
      `${API_BASE_URL}/oauth2/authorization/google`
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgBlue} />

      <header className={styles.header}>
        <div className={styles.logoWrap}>
          <Link to="/">
            <img src={logo} alt="Saveliens logo" />
          </Link>
        </div>

        <Link to="/signup">
          <button className={styles.headerSignup}>
            Sign up
          </button>
        </Link>
      </header>

      <h2 className={styles.pageTitle}>Sign In</h2>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.formPanel}>
            {justRegistered && (
              <div
                className={styles.successBanner}
                role="status"
              >
                🎉 Account created! Sign in to get started.
              </div>
            )}

            <p className={styles.newTo}>
              New to Saveliens?{" "}
              <Link
                to="/signup"
                className={styles.signupLink}
              >
                Sign up
              </Link>
            </p>

            {apiError && (
              <div
                className={styles.apiError}
                role="alert"
              >
                {apiError}
              </div>
            )}

            {passwordChangeMessage && (
              <p role="status" style={{ color: "#15803d" }}>
                {passwordChangeMessage}
              </p>
            )}

            <form onSubmit={handleSubmit} noValidate>

              
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${
                    errors.email ? styles.inputError : ""
                  }`}
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

                {errors.email && (
                  <span className={styles.fieldError}>
                    {errors.email}
                  </span>
                )}
              </div>

              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${
                    errors.password ? styles.inputError : ""
                  }`}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                {errors.password && (
                  <span className={styles.fieldError}>
                    {errors.password}
                  </span>
                )}
              </div>

              <div className={styles.forgotRow}>
                <Link
                  to="/forgot-password"
                  className={styles.forgotLink}
                >
                  Forgot your password?
                </Link>

                <a
                  href="#"
                  className={styles.forgotLink}
                >
                  Problems logging in?
                </a>
              </div>

              <button
                type="submit"
                className={styles.loginBtn}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            {/* Google OAuth authentication */}
            <div className={styles.socialGrid}>
              <button
                type="button"
                className={styles.socialBtn}
                onClick={handleGoogleSignIn}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>

                <span>Log in with Google</span>
              </button>
            </div>

            <p className={styles.disclaimer}>
              If you click "Log in with Google" and are
              not a Saveliens user, your account may be
              created automatically. By continuing, you
              agree to Saveliens's{" "}
              <a
                href="#"
                className={styles.inlineLink}
              >
                Terms &amp; Conditions
              </a>{" "}
              and{" "}
              <a
                href="#"
                className={styles.inlineLink}
              >
                Privacy Policy
              </a>.
            </p>
          </div>

          <div className={styles.promoPanel}>
            <div className={styles.promoBg} />

            <div className={styles.promoContent}>
              <h2 className={styles.promoTitle}>
                Save and organize links by topic.
              </h2>

              <p className={styles.promoDesc}>
                Build a smarter, more structured
                collection of resources
              </p>

              <button
                className={styles.promoBtn}
                type="button"
              >
                See how
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
