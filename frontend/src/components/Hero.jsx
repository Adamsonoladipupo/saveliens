import styles from './Hero.module.css';

const quickLinks = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>, label: 'Github'
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#0065a9" d="m29.01 5.03l-5.766-2.776a1.74 1.74 0 0 0-1.989.338L2.38 19.8a1.166 1.166 0 0 0-.08 1.647q.037.04.077.077l1.541 1.4a1.165 1.165 0 0 0 1.489.066L28.142 5.75A1.158 1.158 0 0 1 30 6.672v-.067a1.75 1.75 0 0 0-.99-1.575"/><path fill="#007acc" d="m29.01 26.97l-5.766 2.777a1.745 1.745 0 0 1-1.989-.338L2.38 12.2a1.166 1.166 0 0 1-.08-1.647q.037-.04.077-.077l1.541-1.4A1.165 1.165 0 0 1 5.41 9.01l22.732 17.24A1.158 1.158 0 0 0 30 25.328v.072a1.75 1.75 0 0 1-.99 1.57"/><path fill="#1f9cf0" d="M23.244 29.747a1.745 1.745 0 0 1-1.989-.338A1.025 1.025 0 0 0 23 28.684V3.316a1.024 1.024 0 0 0-1.749-.724a1.74 1.74 0 0 1 1.989-.339l5.765 2.772A1.75 1.75 0 0 1 30 6.6v18.8a1.75 1.75 0 0 1-.991 1.576Z"/></svg>,
    label: 'Vs Code'
  },
  { icon: '◈', label: 'Figma' },
];

const categories = [
  'Save links', 'Templates', 'Wireframes', 'Links',
  'UI Elements & Cards', 'Digital library', 'Web clipper', 'Resource library',
  'Crome Extension', 'Repositories', 'Knowledge library',
];

const featureCards = [
  {
    title: 'Components',
    desc: 'Browse 3,500+ Components',
    bg: '#f3f4ff',
    icon: '⊞',
  },
  {
    title: 'Resourceful APIs',
    desc: 'Premium APIs',
    bg: '#f3fff6',
    icon: '⚡',
  },
  {
    title: 'Github Repository',
    desc: 'Saved Github Repository Links',
    bg: '#fff8f3',
    icon: '◎',
  },
  {
    title: 'Link collections',
    desc: 'Curated tools and directions',
    bg: '#f3f9ff',
    icon: '⊕',
  },
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.topBadge}>
        A Smarter Way for Designers & Developers to Save and Organize Links
      </div>
      <h1 className={styles.title}>
        The Creator's Library of<br />
        <span className={styles.accent}>Organized Links</span>
      </h1>
      <p className={styles.subtitle}>
        Saveliens is your personal library for saving and organizing links by topic.<br />
        Build a smarter, more structured collection of resources
      </p>

      <div className={styles.searchBar}>
        <span className={styles.searchIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#1a1a2e" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m17 17l4 4M3 11a8 8 0 1 0 16 0a8 8 0 0 0-16 0"/></svg>
        </span>
        <input type="text" placeholder="Search for resources..." className={styles.searchInput} />
      </div>

      <div className={styles.quickLinks}>
        {quickLinks.map((q) => (
          <button key={q.label} className={styles.quickBtn}>
            <span>{q.icon}</span> {q.label}
          </button>
        ))}
      </div>

      <div className={styles.tagRow}>
        {categories.map((cat) => (
          <span key={cat} className={styles.tag}>{cat}</span>
        ))}
      </div>

      <div className={styles.featureGrid}>
        {featureCards.map((card) => (
          <div key={card.title} className={styles.featureCard} style={{ background: card.bg }}>
            <div className={styles.featureIconWrap}>
              <span className={styles.featureIcon}>{card.icon}</span>
            </div>
            <div className={styles.featureInfo}>
              <h3 className={styles.featureTitle}>{card.title}</h3>
              <p className={styles.featureDesc}>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}