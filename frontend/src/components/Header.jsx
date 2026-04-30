import React from "react";
import styles from "../components/Header.module.css"
import logo from "../assets/saveliens_logo.png"
import { useState } from "react";
import { Link } from "react-router";
const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.logo}>
                    <div><img src={logo} alt="logo" /></div>
                    </div>
                    <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
                    <a href="#" className={styles.navLink} onClick={() => setMenuOpen(false)}>Explore</a>
                    <a href="#" className={styles.navLink} onClick={() => setMenuOpen(false)}>
                        Product <span className={styles.arrow}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m5.84 9.59l5.66 5.66l5.66-5.66l-.71-.7l-4.95 4.95l-4.95-4.95z"/></svg>
                        </span>
                    </a>
                    <a href="#" className={styles.navLink} onClick={() => setMenuOpen(false)}>
                        Resources <span className={styles.arrow}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m5.84 9.59l5.66 5.66l5.66-5.66l-.71-.7l-4.95 4.95l-4.95-4.95z"/></svg>
                        </span>
                    </a>
                    <a href="#" className={styles.navLink} onClick={() => setMenuOpen(false)}>Pricing</a>
                    <div className={styles.mobileActions}>
                        <span><Link to={"/signin"} className={styles.loginBtn}>Sign In</Link></span>
                        <span><Link to={"/signup"} className={styles.signupBtnMobile}>Sign up</Link></span>
                    </div>
                    </nav>
            
                    <div className={styles.desktopActions}>
                    <span><Link to={"/signin"} className={styles.loginBtn}>Sign In</Link></span>
                    <span><Link to={"/signup"} className={styles.signupBtn}>Sign up</Link></span>
                    </div>
            
                    <button
                    className={styles.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    >
                    <span className={`${styles.bar} ${menuOpen ? styles.bar1Open : ''}`} />
                    <span className={`${styles.bar} ${menuOpen ? styles.bar2Open : ''}`} />
                    <span className={`${styles.bar} ${menuOpen ? styles.bar3Open : ''}`} />
                    </button>
                </div>
            
                {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}
            </header>
        </>
    );
}
export default Header
