
import { Sparkles, BrainCircuit } from "lucide-react";
import Sidebar from "../components/Sidebar";
import styles from "./Analyze.module.css";

export default function Analyze() {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.iconWrap}>
            <BrainCircuit size={32} />
          </div>

          <span className={styles.badge}>
            <Sparkles size={14} />
            COMING SOON
          </span>

          <h1>
            Understand your collection <span>with AI.</span>
          </h1>

          <p className={styles.description}>
            We're building AI-powered insights to help you
            discover patterns in your saved links, understand
            your interests, and organize your knowledge more
            effectively.
          </p>

          <p className={styles.footer}>
            Something insightful is on its way.
            <Sparkles size={15} />
          </p>
        </div>
      </main>
    </div>
  );
}
