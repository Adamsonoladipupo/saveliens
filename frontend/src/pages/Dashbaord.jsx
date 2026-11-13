
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import HeroBoard from "../components/HeroBoard";
import StatsRow from "../components/StatsRow";
import TopicsSection from "../components/TopicSection";
import RecentLinks from "../components/RecentLinks";

import PageSkeleton from "../components/skeletons/PageSkeleton";
import PageError from "../components/PageError";

import styles from "./Dashboard.module.css";

import { apiFetch,AuthenticationError,} from "../services/apiClient";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const navigate = useNavigate();

  const loadDashboard = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/api/dashboard/me", {
        signal,
      });

      if (signal.aborted) return;

      if (response.status === 401) {
        navigate("/signin", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Failed to load dashboard: ${response.status}`
        );
      }

      const data = await response.json();

      if (signal.aborted) return;

      setDashboardData(data);
      setLinks(data.recentlyAddedLinks || []);
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

    loadDashboard(controller.signal);

    return () => controller.abort();
  }, [loadDashboard, retryCount]);

  if (loading) {
    return <PageSkeleton variant="dashboard" />;
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
      <Sidebar
        firstName={dashboardData.firstName}
        setDashboardData={setDashboardData}
      />

      <main className={styles.main}>
        <SearchBar />

        <HeroBoard
          topics={dashboardData.topics}
          setDashboardData={setDashboardData}
        />

        <StatsRow
          totalTopics={dashboardData.totalTopics}
          totalLinks={dashboardData.totalLinks}
        />

        <TopicsSection
          topics={dashboardData.topics}
          setDashboardData={setDashboardData}
        />

        <RecentLinks
          links={links}
          setLinks={setLinks}
          setDashboardData={setDashboardData}
        />
      </main>
    </div>
  );
}
