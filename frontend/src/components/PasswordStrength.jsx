import zxcvbn from "zxcvbn";
import styles from "./PasswordStrength.module.css";

const labels = [
  "Very weak",
  "Weak",
  "Fair",
  "Strong",
  "Very strong",
];

export default function PasswordStrength({ password = "" }) {
  if (!password) return null;

  const result = zxcvbn(password);
  const score = result.score;

  return (
    <div className={styles.container}>
      <div
        className={styles.meter}
        role="progressbar"
        aria-label="Password strength"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={4}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <span
            key={index}
            className={`${styles.segment} ${
              index <= score ? styles[`score${score}`] : ""
            }`}
          />
        ))}
      </div>

      <p className={styles.label}>
        Password strength: {labels[score]}
      </p>

      {result.feedback.warning && (
        <p className={styles.feedback}>
          {result.feedback.warning}
        </p>
      )}

      {result.feedback.suggestions.map((suggestion, index) => (
        <p key={index} className={styles.feedback}>
          {suggestion}
        </p>
      ))}
    </div>
  );
}