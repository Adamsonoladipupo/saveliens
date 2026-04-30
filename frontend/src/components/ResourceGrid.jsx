import styles from './ResourceGrid.module.css';
import React from 'react';

const tagColors = {
  Free: { bg: '#e8f5e9', color: '#2e7d32' },
  Pro: { bg: '#fff3e0', color: '#e65100' },
};

export default function ResourceGrid({ title, items = []}) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <a href="#" className={styles.browseAll}>Browse all →</a>
        </div>
        <div className={styles.grid}>
          {items.map((item, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardThumb}>
                <div className={styles.thumbPlaceholder} style={{ background: item.thumbBg || '#f0f2ff' }}>
                  <span className={styles.thumbIcon}>{item.icon || '◈'}</span>
                </div>
              </div>
              <div className={styles.cardMeta}>
                <div className={styles.cardTop}>
                  <span className={styles.cardName}>{item.title}</span>
                  {item.tag && (
                    <span
                      className={styles.cardTag}
                      style={{
                        background: tagColors[item.tag]?.bg,
                        color: tagColors[item.tag]?.color,
                      }}
                    >
                      {item.tag}
                    </span>
                  )}
                </div>
                <span className={styles.cardDate}>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}