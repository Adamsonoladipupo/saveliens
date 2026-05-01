import styles from './StatsRow.module.css';
import { FolderOpen, Link2, MoreVertical } from 'lucide-react';

const stats = [
  { icon: FolderOpen, count: 15, label: 'Topics' },
  { icon: Link2, count: 25, label: 'Links' },
];

export default function StatsRow() {
  return (
    <div className={styles.row}>
      {stats.map(({ icon: Icon, count, label }) => (
        <div key={label} className={styles.card}>
          <div className={styles.iconWrap}>
            <Icon size={18} className={styles.icon} />
          </div>
          <div className={styles.info}>
            <span className={styles.count}>{count}</span>
            <span className={styles.label}>{label}</span>
          </div>
          <button className={styles.more} aria-label="More options">
            <MoreVertical size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}