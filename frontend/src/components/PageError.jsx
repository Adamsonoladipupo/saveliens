
import { AlertCircle, RefreshCw } from "lucide-react";

export default function PageError({ message, onRetry }) {
  return (
    <div
      role="alert"
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "24px",
        textAlign: "center",
        fontFamily: '"Inter Tight", sans-serif',
      }}
    >
      <AlertCircle size={40} color="#5b5fc7" />

      <h2 style={{ margin: 0, color: "#1a1a2e" }}>
        We couldn't load your workspace
      </h2>

      <p style={{ maxWidth: 420, color: "#6b7280" }}>
        {message || "Something went wrong. Please try again."}
      </p>

      <button
        type="button"
        onClick={onRetry}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: 0,
          borderRadius: 10,
          padding: "12px 20px",
          background: "#5b5fc7",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );
}
