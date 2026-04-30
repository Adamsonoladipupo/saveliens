import styles from './Footer.module.css';
import svgLogo from "../assets/logo_icon.svg"

const footerLinks = {
  Explore: ['All Components', 'Wireframes', 'Illustrations', 'UI Elements', 'Banners', 'Templates'],
  'Popular Categories': ['Backgrounds', 'Content', 'FAQ', 'Utility Elements', 'Headers', 'Content', 'Pricing', 'Blog', 'Testimonials'],
  Resources: ['Blogs', 'Pricing', 'Press', 'Support Center', 'Join Discord', "What's New"],
  Store: ['Club Subscription', 'Premium Templates', 'Saveliens Tools', 'Figma Component Plugin', 'Webflow Component Generator', 'Webflow Class Sketch Organiser', 'Webflow Asset Optimizer', 'Webflow Icon Library', 'Webflow Booster App'],
  Company: ['About', 'Add', 'Contact', 'License', 'Terms of Service', 'Privacy Policy'],
};

const socials = [
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><g fill="none"><g clip-path="url(#SVGG1Ot4cAD)"><path fill="currentColor" d="M11.025.656h2.147L8.482 6.03L14 13.344H9.68L6.294 8.909l-3.87 4.435H.275l5.016-5.75L0 .657h4.43L7.486 4.71zm-.755 11.4h1.19L3.78 1.877H2.504z"/></g><defs><clipPath id="SVGG1Ot4cAD"><path fill="#fff" d="M0 0h14v14H0z"/></clipPath></defs></g></svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.72 4H5.37A1.31 1.31 0 0 0 4 5.25v13.38A1.41 1.41 0 0 0 5.37 20h13.35A1.34 1.34 0 0 0 20 18.63V5.25A1.23 1.23 0 0 0 18.72 4M9 17.34H6.67v-7.13H9ZM7.89 9.13A1.18 1.18 0 0 1 6.67 7.9a1.18 1.18 0 0 1 1.24-1.23A1.18 1.18 0 0 1 9.13 7.9a1.18 1.18 0 0 1-1.24 1.23m9.45 8.21H15v-3.9c0-.93-.33-1.57-1.16-1.57a1.25 1.25 0 0 0-1.17.84a1.4 1.4 0 0 0-.08.57v4.06h-2.3v-7.13h2.3v1a2.32 2.32 0 0 1 2.1-1.21c1.51 0 2.65 1 2.65 3.13Z"/></svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8"/><path d="M3 16V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z"/><path stroke-linecap="round" stroke-linejoin="round" d="m17.5 6.51l.01-.011"/></g></svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M18.896 0H1.104C.494 0 0 .494 0 1.104v17.792C0 19.506.494 20 1.104 20h9.578v-7.745H8.076V9.237h2.606V7.01c0-2.584 1.578-3.99 3.883-3.99c1.104 0 2.052.082 2.329.119v2.7h-1.598c-1.254 0-1.496.596-1.496 1.47v1.927h2.989l-.39 3.018h-2.6V20h5.097c.61 0 1.104-.494 1.104-1.104V1.104C20 .494 19.506 0 18.896 0"/></svg>
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}><img src={svgLogo} alt="logo" /></span>
              <span className={styles.logoText}>Saveliens</span>
            </div>
            <p className={styles.tagline}>Designers & Developers Resources</p>
            <div className={styles.socials}>
              {socials.map((s, i) => (
                <a key={i} href="#" className={styles.socialBtn}>{s}</a>
              ))}
            </div>

            <div className={styles.integrations}>
              <div className={styles.integrationItem}>
                <span className={styles.intIcon} style={{ background: '#ff6b6b' }}>H</span>
                <span className={styles.intLabel}>HubStory · Social News</span>
              </div>
              <div className={styles.integrationItem}>
                <span className={styles.intIcon} style={{ background: '#4ecdc4' }}>O</span>
                <span className={styles.intLabel}>Optic · Webflow Optimization</span>
              </div>
              <div className={styles.integrationItem}>
                <span className={styles.intIcon} style={{ background: '#a78bfa' }}>O</span>
                <span className={styles.intLabel}>Outline · Micro Websites</span>
              </div>
              <div className={styles.integrationItem}>
                <span className={styles.intIcon} style={{ background: '#60a5fa' }}>F</span>
                <span className={styles.intLabel}>Flora · Webflow Directory</span>
              </div>
            </div>
          </div>

          <div className={styles.linksGrid}>
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className={styles.linkGroup}>
                <h4 className={styles.groupTitle}>{group}</h4>
                <ul className={styles.linkList}>
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className={styles.link}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>© 2026 Saveliens. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}