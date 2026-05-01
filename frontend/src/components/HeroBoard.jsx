import styles from './HeroBoard.module.css';
import { Plus } from 'lucide-react';

export default function HeroBoard() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <span className={styles.eyebrow}>ONLINE COURSE</span>
        <h1 className={styles.title}>The Creator's Library of<br />Organized Links.</h1>
        <button className={styles.addBtn}>
          Add new link <Plus size={16} />
        </button>
      </div>
      <div className={styles.decoration}>
        <div className={styles.sparkle} />
        <div className={`${styles.sparkle} ${styles.sparkleLg}`} />
        <div className={`${styles.sparkle} ${styles.sparkleSm}`} />
      </div>
    </section>
  );
}