
import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

import Sidebar from "../components/Sidebar";
import PasswordStrength from "../components/PasswordStrength";
import { apiFetch, invalidateSession, AuthenticationError } from "../services/apiClient";
import styles from "./Settings.module.css";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function Settings() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [showPasswords, setShowPasswords] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const toggleVisibility = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setError("");

    if (!form.currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (
      form.newPassword.length < 12 ||
      form.newPassword.length > 128
    ) {
      setError("Your new password must contain 12 to 128 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Your new passwords do not match.");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError("Choose a different password.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await apiFetch("/api/users/me/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.error ||
          data.message ||
          "Unable to change your password."
        );
      }

      // Backend has revoked refresh sessions.
      // Prevent pending refreshes from restoring the old session.
      invalidateSession();

      setForm(initialForm);

      navigate("/signin", {
        replace: true,
        state: {
          message: "Password changed successfully. Please sign in again.",
        },
      });
    } catch (err) {
      if (err instanceof AuthenticationError) {
        invalidateSession();
        navigate("/signin", { replace: true });
        return;
      }

      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderPasswordField = (label, name, placeholder) => (
    <div className={styles.field}>
      <label htmlFor={name}>{label}</label>

      <div className={styles.inputWrapper}>
        <input
          id={name}
          name={name}
          type={showPasswords[name] ? "text" : "password"}
          value={form[name]}
          onChange={updateField}
          placeholder={placeholder}
          autoComplete={
            name === "currentPassword"
              ? "current-password"
              : "new-password"
          }
          required
        />

        <button
          type="button"
          className={styles.visibilityButton}
          onClick={() => toggleVisibility(name)}
          aria-label={showPasswords[name] ? "Hide password" : "Show password"}
        >
          {showPasswords[name] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Settings</h1>
          <p>Manage your account and security preferences.</p>
        </header>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <div className={styles.iconBox}>
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2>Account security</h2>
              <p>Keep your Saveliens account protected.</p>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.formHeading}>
            <LockKeyhole size={19} />
            <h3>Change password</h3>
          </div>

          <p className={styles.description}>
            Enter your current password and choose a new one.
            You'll need to sign in again after updating it.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {renderPasswordField(
              "Current password",
              "currentPassword",
              "Enter current password"
            )}

            {renderPasswordField(
              "New password",
              "newPassword",
              "Enter new password"
            )}

            <PasswordStrength password={form.newPassword} />

            {renderPasswordField(
              "Confirm new password",
              "confirmPassword",
              "Confirm new password"
            )}

            {error && (
              <div className={styles.error} role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? "Updating password..." : "Update password"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
