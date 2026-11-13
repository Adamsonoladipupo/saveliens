
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "./Sidebar";
import LinkRow from "./LinkRow";
import PageError from "./PageError";
import TopicDetailsSkeleton from "./skeletons/TopicDetailsSkeleton";

import {
  apiFetch,
  AuthenticationError,
} from "../services/apiClient";

import styles from "./TopicDetails.module.css";

export default function TopicDetails() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function loadTopic() {
      setLoading(true);
      setError("");
      setNotFound(false);
      setTopic(null);
      setLinks([]);

      try {
        const response = await apiFetch(
          `/api/topic/${encodeURIComponent(topicId)}`,
          { signal }
        );

        if (signal.aborted) return;

        if (response.status === 401) {
          navigate("/signin", { replace: true });
          return;
        }

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Failed to load topic: ${response.status}`
          );
        }

        const data = await response.json();

        if (signal.aborted) return;

        setTopic({
          title: data.title,
          description: data.description,
          firstName: data.firstName,
        });

        setLinks(
          Array.isArray(data.links) ? data.links : []
        );
      } catch (err) {
        if (signal.aborted) return;

        if (err instanceof AuthenticationError) {
          navigate("/signin", { replace: true });
          return;
        }

        console.error("Topic details error:", err);

        setError(
          "Unable to load this topic. Please try again."
        );
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadTopic();

    return () => controller.abort();
  }, [topicId, retryCount, navigate]);

  if (loading) {
    return <TopicDetailsSkeleton />;
  }

  if (notFound) {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <h1 className={styles.title}>
            Topic not found
          </h1>

          <p>
            This topic may have been deleted or is no longer available.
          </p>

          <button
            type="button"
            onClick={() => navigate("/topicspage")}
          >
            Back to Topics
          </button>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <PageError
            message={error}
            onRetry={() =>
              setRetryCount((count) => count + 1)
            }
          />
        </main>
      </div>
    );
  }

  if (!topic) {
    return null;
  }

  return (
    <div className={styles.layout}>
      <Sidebar firstName={topic.firstName} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          {topic.title}
        </h1>

        <p>{topic.description}</p>

        <div className={styles.list}>
          {links.map((link) => (
            <LinkRow
              key={link.id}
              {...link}
              setLinks={setLinks}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
