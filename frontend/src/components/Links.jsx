import React from "react";
import LinkRow from "../components/LinkRow";
import styles from "./Links.module.css";

export default function Links({ links = [], setDashboardData }) {

  return (

    <div className={styles.layout}>
      <main className={styles.main}>

        <h3 className={styles.title}>
          All Links
        </h3>

        <div className={styles.list}>

          {links.map((link) => (

            <LinkRow
              key={link.id}
              {...link}
              setDashboardData={setDashboardData}
            />

          ))}

        </div>

      </main>

    </div>
  );
}