
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import styles from "./SignUp.module.css";
import logo from "../assets/saveliens_logo.png";
import { signUpSchema } from "../validation/authSchemas";
import PasswordStrength from "../components/PasswordStrength";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/users`;

const occupations = [
  "Student",
  "Teacher",
  "Business_Professional",
  "Designer",
  "Developer",
  "Marketing",
  "Consultant",
  "Freelancer",
  "Other",
];

const occupationLabels = {
  Student: "Student",
  Teacher: "Teacher",
  Business_Professional: "Business Professional",
  Designer: "Designer",
  Developer: "Developer",
  Marketing: "Marketing",
  Consultant: "Consultant",
  Freelancer: "Freelancer",
  Other: "Other",
};

export default function SignUp() {
  const navigate = useNavigate();

  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [searchParams] = useSearchParams();

  const oauthError = searchParams.get("oauth_error");

  const oauthMessages = {
    failed: "Google authentication was cancelled or unsuccessful.",
    email: "Google did not provide a verified email address.",
    conflict:
      "An account already exists with this email. Sign in using your existing method.",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      occupation: "",
      agreed: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (formData) => {
    setApiError("");

    // Only send fields expected by the existing backend.
    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      occupation: formData.occupation,
    };

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        navigate("/signin", {
          state: { registered: true },
        });
        return;
      }

      const data = await res.json().catch(() => null);

      setApiError(
        data?.message ||
          (res.status === 409
            ? "An account with this email already exists."
            : res.status === 400
              ? "Please check your details and try again."
              : "Something went wrong. Please try again later.")
      );
    } catch {
      setApiError(
        "Unable to connect to the server. Please check your connection."
      );
    }
  };

  const clearApiError = () => {
    if (apiError) setApiError("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgTop} />
      <div className={styles.bgWave} />

      <header className={styles.header}>
        <div className={styles.logoWrap}>
          <Link to="/">
            <img src={logo} alt="Saveliens logo" />
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create an account</h1>


          {oauthError && (
            <div className={styles.apiError} role="alert">
              {oauthMessages[oauthError] ||
                "Google authentication failed. Please try again."}
            </div>
          )}
          {apiError && (
            <div className={styles.apiError} role="alert">
              {apiError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            onChange={clearApiError}
            className={styles.form}
            noValidate
          >
            {/* First name and last name */}
            <div className={styles.row}>
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${
                    errors.firstName ? styles.inputError : ""
                  }`}
                  type="text"
                  placeholder="First name"
                  autoComplete="given-name"
                  aria-label="First name"
                  aria-invalid={!!errors.firstName}
                  {...register("firstName")}
                />

                {errors.firstName && (
                  <span className={styles.fieldError} role="alert">
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${
                    errors.lastName ? styles.inputError : ""
                  }`}
                  type="text"
                  placeholder="Last name"
                  autoComplete="family-name"
                  aria-label="Last name"
                  aria-invalid={!!errors.lastName}
                  {...register("lastName")}
                />

                {errors.lastName && (
                  <span className={styles.fieldError} role="alert">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${
                  errors.email ? styles.inputError : ""
                }`}
                type="email"
                placeholder="Email"
                autoComplete="email"
                aria-label="Email address"
                aria-invalid={!!errors.email}
                {...register("email")}
              />

              {errors.email && (
                <span className={styles.fieldError} role="alert">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className={styles.inputWrap}>
              <div style={{ position: "relative" }}>
                <input
                  className={`${styles.input} ${
                    errors.password ? styles.inputError : ""
                  }`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="new-password"
                  aria-label="Password"
                  aria-invalid={!!errors.password}
                  style={{ paddingRight: "70px" }}
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <span className={styles.fieldError} role="alert">
                  {errors.password.message}
                </span>
              )}

              <PasswordStrength password={password} />
            </div>

            {/* Confirm password */}
            <div className={styles.inputWrap}>
              <div style={{ position: "relative" }}>
                <input
                  className={`${styles.input} ${
                    errors.confirmPassword ? styles.inputError : ""
                  }`}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  aria-label="Confirm password"
                  aria-invalid={!!errors.confirmPassword}
                  style={{ paddingRight: "70px" }}
                  {...register("confirmPassword")}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmation password"
                      : "Show confirmation password"
                  }
                  aria-pressed={showConfirmPassword}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.confirmPassword && (
                <span className={styles.fieldError} role="alert">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Occupation */}
            <div className={styles.inputWrap}>
              <div className={styles.selectWrap}>
                <select
                  className={`${styles.input} ${styles.select} ${
                    errors.occupation ? styles.inputError : ""
                  }`}
                  aria-label="Occupation"
                  aria-invalid={!!errors.occupation}
                  {...register("occupation")}
                >
                  <option value="" disabled>
                    Occupation
                  </option>

                  {occupations.map((occupation) => (
                    <option key={occupation} value={occupation}>
                      {occupationLabels[occupation]}
                    </option>
                  ))}
                </select>

                <span className={styles.selectArrow}>▾</span>
              </div>

              {errors.occupation && (
                <span className={styles.fieldError} role="alert">
                  {errors.occupation.message}
                </span>
              )}
            </div>

            {/* Age confirmation */}
            <div className={styles.inputWrap}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  aria-invalid={!!errors.agreed}
                  {...register("agreed")}
                />

                <span className={styles.checkboxText}>
                  I certify that I am at least 13 years old or I have
                  reached the minimum age limit set out in the laws of
                  my country of residence.{" "}
                  <a href="#" className={styles.link}>
                    Read more →
                  </a>
                </span>
              </label>

              {errors.agreed && (
                <span className={styles.fieldError} role="alert">
                  {errors.agreed.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={styles.continueBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className={styles.spinner} />
              ) : (
                "Continue"
              )}
            </button>

            <p className={styles.terms}>
              By proceeding, you agree to the{" "}
              <a href="#" className={styles.link}>
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="#" className={styles.link}>
                Privacy Policy
              </a>.
            </p>

            {/* Google OAuth will be implemented separately */}
            <button
              type="button"
              className={styles.googleBtn}
              title="Google sign-up is coming soon"
              onClick={() => {
                const backendUrl = import.meta.env.VITE_API_BASE_URL;

                if (!backendUrl) {
                  setApiError("Google authentication is not configured.");
                  return;
                }

                window.location.assign(
                  `${backendUrl.replace(/\/$/, "")}/oauth2/authorization/google`
                );
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 48 48"
                className={styles.googleIcon}
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
              Sign up with Google
            </button>

            <p className={styles.switchText}>
              Already have an account?{" "}
              <Link to="/signin" className={styles.switchLink}>
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
