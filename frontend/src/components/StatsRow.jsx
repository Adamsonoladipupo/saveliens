import styles from './StatsRow.module.css';
import { FolderOpen, Link2, MoreVertical } from 'lucide-react';

  // const countTopics = "";
  // const countLinks = "";



export default function StatsRow({totalTopics, totalLinks}) {
  const stats = [
  { icon: FolderOpen, count: totalTopics, label: 'Topics' },
  { icon: Link2, count: totalLinks, label: 'Links'},
];
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