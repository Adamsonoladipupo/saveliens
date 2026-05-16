import styles from './TopicCard.module.css';

import {
  Share2,
  Pencil,
  Trash2,
  FolderOpen
} from 'lucide-react';

import { Link } from 'react-router';

export default function TopicCard({
  topic,
  setDashboardData
}) {

  const BASE_URL =
    "http://localhost:8080/api/topic";

  const handleDeleteTopic = async (e) => {

    e.preventDefault();

    const confirmDelete = window.confirm(
      `Delete "${topic.title}" topic?`
    );

    if (!confirmDelete) return;

    try {

      const token =
        sessionStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/${topic.id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete topic"
        );
      }

      setDashboardData((prev) => ({
        ...prev,

        topics: prev.topics.filter(
          (t) => t.id !== topic.id
        ),

        totalTopics:
          prev.totalTopics - 1,

      }));

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <Link
      to={`/topics/${topic.id}`}
      className={styles.cardLink}
    >

      <div className={styles.card}>

        <div className={styles.iconWrap}>

          <div className={styles.folderIcon}>

            <FolderOpen size={38} />

          </div>

        </div>

        <div className={styles.body}>

          <span className={styles.tag}>
            TOPIC
          </span>

          <h3 className={styles.title}>
            {topic.title}
          </h3>

          <p className={styles.description}>
            {topic.topicDescription}
          </p>

          <div className={styles.footer}>

            <span className={styles.linkCount}>
              {topic.linkCount} Links
            </span>

            <div className={styles.actions}>

              <button
                className={styles.actionBtn}
                aria-label="Share"
                onClick={(e) =>
                  e.preventDefault()
                }
              >
                <Share2 size={14} />
              </button>

              <button
                className={styles.actionBtn}
                aria-label="Edit"
                onClick={(e) =>
                  e.preventDefault()
                }
              >
                <Pencil size={14} />
              </button>

              <button
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                aria-label="Delete"
                onClick={handleDeleteTopic}
              >
                <Trash2 size={14} />
              </button>

            </div>

          </div>

        </div>

      </div>

    </Link>
  );
}