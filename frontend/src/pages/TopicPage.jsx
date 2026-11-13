
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import Topics from "../components/Topics";
import PageSkeleton from "../components/skeletons/PageSkeleton";
import PageError from "../components/PageError";

import styles from "./Topics.module.css";

import { apiFetch,AuthenticationError,} from "../services/apiClient";

export default function TopicsPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const navigate = useNavigate();

  const loadTopics = useCallback(async (signal) => {
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
        throw new Error(`Failed to load topics: ${response.status}`);
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

    loadTopics(controller.signal);

    return () => controller.abort();
  }, [loadTopics, retryCount]);

  if (loading) {
    return <PageSkeleton variant="topics" />;
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

        <Topics
          topics={dashboardData.topics || []}
          setDashboardData={setDashboardData}
        />
      </main>
    </div>
  );
}
