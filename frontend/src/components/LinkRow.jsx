import styles from './LinkRow.module.css';
import { Eye, ExternalLink, Trash2 } from 'lucide-react';

export default function LinkRow({ avatar, title, date, topic, topicLabel }) {
  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <img src={avatar} alt={title} className={styles.avatar} />
        <div className={styles.info}>
          <span className={styles.title}>{title}</span>
          <span className={styles.date}>{date}</span>
        </div>
      </div>
      <span className={styles.topicBadge}>{topicLabel || 'TOPIC'}</span>
      <span className={styles.topicName}>{topic}</span>
      <div className={styles.actions}>
        <button className={styles.actionBtn} aria-label="View"><Eye size={14} /></button>
        <button className={styles.actionBtn} aria-label="Open"><ExternalLink size={14} /></button>
        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} aria-label="Delete"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}