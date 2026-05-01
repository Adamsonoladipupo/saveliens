import styles from './TopicCard.module.css';
import { Share2, Pencil, Trash2, Heart } from 'lucide-react';

export default function TopicCard({ image, title, description }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={image} alt={title} className={styles.image} />
        <button className={styles.heartBtn} aria-label="Save">
          <Heart size={14} />
        </button>
      </div>
      <div className={styles.body}>
        <span className={styles.tag}>TOPIC TITLE</span>
        <p className={styles.title}>{title}</p>
        <div className={styles.actions}>
          <button className={styles.actionBtn} aria-label="Share"><Share2 size={14} /></button>
          <button className={styles.actionBtn} aria-label="Edit"><Pencil size={14} /></button>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} aria-label="Delete"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
}