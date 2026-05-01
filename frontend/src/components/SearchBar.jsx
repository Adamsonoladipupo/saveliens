import styles from './SearchBar.module.css';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBox}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search your course here...."
          className={styles.input}
        />
      </div>
      <button className={styles.filterBtn} aria-label="Filter">
        <SlidersHorizontal size={18} />
      </button>
    </div>
  );
}