import styles from './Sidebar.module.css';
import { LayoutDashboard, BookOpen, Link2, BarChart2, User, Settings, LogOut, Star } from 'lucide-react';
import { Link } from 'react-router';
import logo from "../assets/saveliens_logo.png"

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: BookOpen, label: 'Topics' },
  { icon: Link2, label: 'Links' },
  { icon: BarChart2, label: 'Analyze' },
];

const bottomItems = [
  { icon: User, label: 'Profile' },
  { icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>

        <div><img src={logo} alt="logo" /></div>
      </div>

      <nav className={styles.nav}>
        <p className={styles.navLabel}>OVERVIEW</p>
        <ul className={styles.navList}>
          {navItems.map(({ icon: Icon, label, active }) => (
            <li key={label}>
              <a className={`${styles.navItem} ${active ? styles.active : ''}`} href="#">
                <Icon size={18} className={styles.navIcon} />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.bottomNav}>
        {bottomItems.map(({ icon: Icon, label }) => (
          <a key={label} className={styles.navItem} href="#">
            <Icon size={18} className={styles.navIcon} />
            <span>{label}</span>
          </a>
        ))}
        <a className={`${styles.navItem} ${styles.logout}`} href="#">
          <LogOut size={18} className={styles.navIcon} />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
}