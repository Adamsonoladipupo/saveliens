
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import Links from "../components/Links";
import PageSkeleton from "../components/skeletons/PageSkeleton";
import PageError from "../components/PageError";

import styles from "./Links.module.css";

import { apiFetch,AuthenticationError,} from "../services/apiClient";

export default function LinksPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const navigate = useNavigate();

  const loadLinks = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/api/dashboard/me", {
        signal,
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/signin", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to load links: ${response.status}`);
      }

      const data = await response.json();

      if (!signal.aborted) {
        setDashboardData(data);
      }
    } 
    catch (err) {
        if (signal.aborted) return;

        if (err instanceof AuthenticationError) {
            navigate("/signin", { replace: true });
            return;
        }

        console.error("Page loading error:", err);

        setError(
            "Unable to load your workspace. Please try again."
        );
    }
    finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();

    loadLinks(controller.signal);

    return () => controller.abort();
  }, [loadLinks, retryCount]);

  if (loading) {
    return <PageSkeleton variant="links" />;
  }

  if (error) {
    return (
      <PageError
        message={error}
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className={styles.layout}>
      <Sidebar firstName={dashboardData.firstName} />

      <main className={styles.main}>
        <SearchBar />

        <Links
          links={dashboardData.recentlyAddedLinks || []}
          setDashboardData={setDashboardData}
        />
      </main>
    </div>
  );
}
