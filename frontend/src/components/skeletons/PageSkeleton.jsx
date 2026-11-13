
import Sidebar from "../Sidebar";
import SearchBar from "../SearchBar";
import styles from "./PageSkeleton.module.css";

function Block({ width = "100%", height = 14, radius = 8 }) {
  return (
    <div
      className={styles.block}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

function SectionTitle({ width = "150px" }) {
  return (
    <div className={styles.sectionTitle}>
      <Block width={width} height={20} />
      <Block width="65px" height={12} />
    </div>
  );
}

function DashboardContent() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <Block width="100px" height={11} />
          <Block width="75%" height={28} />
          <Block width="130px" height={36} radius={20} />
        </div>
      </div>

      <div className={styles.stats}>
        {[1, 2].map((item) => (
          <div className={styles.statCard} key={item}>
            <Block width="40px" height={40} radius={20} />
            <div className={styles.statText}>
              <Block width="65px" height={22} />
              <Block width="100px" height={12} />
            </div>
          </div>
        ))}
      </div>

      <section className={styles.section}>
        <SectionTitle width="130px" />
        <div className={styles.topicGrid}>
          {[1, 2, 3].map((item) => (
            <div className={styles.topicCard} key={item}>
              <Block width="42px" height={42} radius={12} />
              <Block width="75%" height={16} />
              <Block width="55%" height={11} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <SectionTitle width="145px" />
        <LinkRows />
      </section>
    </>
  );
}

function LinkRows() {
  return (
    <div className={styles.linkList}>
      {[1, 2, 3, 4, 5].map((item) => (
        <div className={styles.linkRow} key={item}>
          <Block width="40px" height={40} radius={10} />
          <div className={styles.linkText}>
            <Block width="65%" height={15} />
            <Block width="40%" height={11} />
          </div>
          <Block width="24px" height={24} radius={6} />
        </div>
      ))}
    </div>
  );
}

function LinksContent() {
  return (
    <section className={styles.section}>
      <SectionTitle width="150px" />
      <LinkRows />
    </section>
  );
}

function TopicsContent() {
  return (
    <section className={styles.section}>
      <SectionTitle width="145px" />
      <div className={styles.topicGrid}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div className={styles.topicCard} key={item}>
            <Block width="42px" height={42} radius={12} />
            <Block width="75%" height={16} />
            <Block width="55%" height={11} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PageSkeleton({
  variant = "dashboard",
}) {
  return (
    <div
      className={styles.layout}
      role="status"
      aria-label="Loading your workspace"
      aria-busy="true"
    >
      <Sidebar />

      <main className={styles.main}>
        <SearchBar />

        <div className={styles.content} aria-hidden="true">
          {variant === "dashboard" && <DashboardContent />}
          {variant === "links" && <LinksContent />}
          {variant === "topics" && <TopicsContent />}
        </div>

        <span className={styles.srOnly}>
          Loading your workspace. Please wait.
        </span>
      </main>
    </div>
  );
}
