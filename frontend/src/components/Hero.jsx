import styles from './Hero.module.css';

const quickLinks = [
  { icon: '⬡', label: 'Github' },
  { icon: '⌨', label: 'Vs Code' },
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
        <span className={styles.searchIcon}>🔍</span>
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