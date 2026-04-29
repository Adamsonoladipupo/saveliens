import React from "react";
import styles from "../pages/landingPage.module.css"
import logoPath from "../assets"
const Header = () => {
    return (
        <>
            <header className={styles.navbar}>
                <div className={styles.navContainer}>
                    {/* <div className={styles.logo}>Saveliens</div> */}
                    <div><img src={logoPath/saveliens_logo.png} alt="logo" /></div>

                    <nav className={styles.navLinks}>
                    <a href="#">Explore</a>
                    <a href="#">Product</a>
                    <a href="#">Resources</a>
                    <a href="#">Pricing</a>
                    </nav>

                    <div className={styles.navActions}>
                    <button className={styles.login}>Login</button>
                    <button className={styles.signup}>Sign up</button>
                    </div>
                </div>
            </header>
        </>
    );
}
export default Header
