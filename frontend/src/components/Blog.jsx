import styles from './Blog.module.css';

const posts = [
  {
    title: 'Why Organizing Your Saved Links Matters',
    desc: 'Learn how a structured collection can save your time and improve productivity.',
    bg: '#1a1a2e',
    label: 'Powerup your sites with Flowbase Boosters',
  },
  {
    title: 'Top 20 UI Inspiration Sites (2023)',
    desc: 'We\'ve found the top 20 UI inspiration sites that will keep your fire for inspiration for years.',
    bg: '#4756e8',
    label: 'Top 20 UI Inspiration Sites (2023)',
  },
  {
    title: 'Best Way to Save Links Without Losing Them',
    desc: 'Discover how to save important resources and never again lose that important resource app.',
    bg: '#0f3460',
    label: 'G2 ONE',
  },
];

export default function Blog() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>Saveliens Blog</h2>
            <p className={styles.sectionSub}>Discover articles and tutorials to help you build better</p>
          </div>
          <a href="#" className={styles.browseAll}>Browse all →</a>
        </div>
        <div className={styles.grid}>
          {posts.map((post, i) => (
            <article key={i} className={styles.postCard}>
              <div className={styles.postThumb} style={{ background: post.bg }}>
                <span className={styles.postThumbLabel}>{post.label}</span>
              </div>
              <div className={styles.postMeta}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postDesc}>{post.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}