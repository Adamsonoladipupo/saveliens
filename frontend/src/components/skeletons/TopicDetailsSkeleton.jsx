
import Sidebar from "../Sidebar";
import styles from "./TopicDetailsSkeleton.module.css";

function SkeletonBlock({ width, height, radius = 8 }) {
  return (
    <div
      className={styles.block}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

export default function TopicDetailsSkeleton() {
  return (
    <div
      className={styles.layout}
      role="status"
      aria-label="Loading topic details"
      aria-busy="true"
    >
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.content} aria-hidden="true">
          <div className={styles.heading}>
            <SkeletonBlock width="45%" height={32} />
            <SkeletonBlock width="70%" height={14} />
          </div>

          <div className={styles.list}>
            {Array.from({ length: 5 }, (_, index) => (
              <div className={styles.linkRow} key={index}>
                <SkeletonBlock
                  width={48}
                  height={48}
                  radius={14}
                />

                <div className={styles.linkInfo}>
                  <SkeletonBlock width="65%" height={14} />
                  <SkeletonBlock width="40%" height={11} />
                </div>

                <SkeletonBlock
                  width={72}
                  height={28}
                  radius={20}
                />

                <SkeletonBlock
                  width={30}
                  height={30}
                  radius={10}
                />
              </div>
            ))}
          </div>
        </div>

        <span className={styles.srOnly}>
          Loading topic details. Please wait.
        </span>
      </main>
    </div>
  );
}
