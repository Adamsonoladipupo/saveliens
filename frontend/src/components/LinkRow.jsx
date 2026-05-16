import styles from './LinkRow.module.css';

import {
  ExternalLink,
  Trash2,
  Link2
} from 'lucide-react';

export default function LinkRow({
  id,
  url,
  topicId,
  topicTitle,
  setLinks,
  setDashboardData,
}) {

  // const BASE_URL ="http://localhost:8080/api/topic";
  const BASE_URL=`${import.meta.env.VITE_API_BASE_URL}/api/topic`;

  const handleDeleteLink = async () => {

    const confirmDelete = window.confirm(
      "Delete this link?"
    );

    if (!confirmDelete) return;

    try {

      const token =
        sessionStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/${topicId}/links/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete link");
      }

      if (setLinks) {

        setLinks((prev) =>
          prev.filter(
            (link) => link.id !== id
          )
        );

      }

      if (setDashboardData) {

        setDashboardData((prev) => ({

          ...prev,

          totalLinks:
            prev.totalLinks > 0
              ? prev.totalLinks - 1
              : 0,

          recentlyAddedLinks:
            prev.recentlyAddedLinks.filter(
              (link) => link.id !== id
            ),

        }));

      }


    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className={styles.row}>

      <div className={styles.left}>

        <div className={styles.avatar}>
          <Link2 size={18} />
        </div>

        <div className={styles.linkInfo}>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.url}
          >

            <ExternalLink size={14} />
            <span>{url}</span>
          </a>

        </div>

      </div>

      <div className={styles.right}>

        <div className={styles.topic}>
          {topicTitle}
        </div>

        <button
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={handleDeleteLink}
        >
          <Trash2 size={16} />
        </button>

      </div>

    </div>
  );
}