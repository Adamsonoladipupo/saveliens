import { useState } from 'react';
import styles from './Sidebar.module.css';
import { LayoutDashboard, BookOpen, Link2, BarChart2, User, Settings, LogOut, Star, Menu, X } from 'lucide-react';
import logo from "../assets/saveliens_logo.png"
import { Link } from 'react-router';

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
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <div className={styles.mobileTopBar}>
        <button className={styles.hamburger} onClick={toggleSidebar} aria-label="Toggle menu">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className={styles.mobileLogo}>
          <div><img src={logo} alt="logo" /></div>
        </div>
      </div>

      {isOpen && (
        <div className={styles.overlay} onClick={closeSidebar} aria-hidden="true" />
      )}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <button className={styles.closeBtn} onClick={closeSidebar} aria-label="Close menu">
          <X size={20} />
        </button>

        <div className={styles.logo}>
          <div><img src={logo} alt="logo" /></div>
        </div>

        <nav className={styles.nav}>
          <p className={styles.navLabel}>OVERVIEW</p>
          <ul className={styles.navList}>
            {navItems.map(({ icon: Icon, label, active }) => (
              <li key={label}>
                <a
                  className={`${styles.navItem} ${active ? styles.active : ''}`}
                  href="#"
                  onClick={closeSidebar}
                >
                  <Icon size={18} className={styles.navIcon} />
                  <span className={styles.navText}>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.bottomNav}>
          {bottomItems.map(({ icon: Icon, label }) => (
            <a key={label} className={styles.navItem} href="#" onClick={closeSidebar}>
              <Icon size={18} className={styles.navIcon} />
              <span className={styles.navText}>{label}</span>
            </a>
          ))}
            <Link to="/signin" lassName={`${styles.navItem} ${styles.logout}`}>
            <LogOut size={18} className={styles.navIcon} />
            <span className={styles.navText}>Logout</span>
            </Link>
        </div>
      </aside>
    </>
  );
}