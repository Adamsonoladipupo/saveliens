import React from "react";
import TopicCard from "../components/TopicCard";
import styles from "./Topics.module.css";

export default function Topics({ topics = [], setDashboardData }) {

  return (

    <div className={styles.layout}>

      <main className={styles.main}>

        <h3 className={styles.title}>
          All Topics
        </h3>
        <div className={styles.grid}>

          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              setDashboardData={setDashboardData}
            />
          ))}

        </div>

      </main>

    </div>
  );
}