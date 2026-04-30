import styles from './Footer.module.css';

const footerLinks = {
  Explore: ['All Components', 'Wireframes', 'Illustrations', 'UI Elements', 'Banners', 'Templates'],
  'Popular Categories': ['Backgrounds', 'Content', 'FAQ', 'Utility Elements', 'Headers', 'Content', 'Pricing', 'Blog', 'Testimonials'],
  Resources: ['Blogs', 'Pricing', 'Press', 'Support Center', 'Join Discord', "What's New"],
  Store: ['Club Subscription', 'Premium Templates', 'Saveliens Tools', 'Figma Component Plugin', 'Webflow Component Generator', 'Webflow Class Sketch Organiser', 'Webflow Asset Optimizer', 'Webflow Icon Library', 'Webflow Booster App'],
  Company: ['About', 'Add', 'Contact', 'License', 'Terms of Service', 'Privacy Policy'],
};

const socials = ['𝕏', 'in', '⬡', 'f', '▶', '◎'];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>◈</span>
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