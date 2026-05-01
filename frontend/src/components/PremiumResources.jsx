import styles from './PremiumResources.module.css';

const premiumItems = [
  { title: 'Figma', category: 'Figma · Figma', price: '$20.00', accent: '#1a1a2e', lightText: true },
  { title: 'Mercury', category: 'Figma · Figma', price: '$20.00', accent: '#fff', lightText: false, subtitle: 'Free Landing Pages' },
  { title: 'Sparks', category: 'Figma · Figma', price: '$10.00', accent: '#f8f9ff', lightText: false, subtitle: 'Database' },
  { title: 'Linkhub', category: 'Notion · notion', price: '$10.00', accent: '#1a1a2e', lightText: true, subtitle: 'Github Repositories' },
];

export default function PremiumResources() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Premium Resources</h2>
          <a href="#" className={styles.browseAll}>Browse all →</a>
        </div>
        <div className={styles.grid}>
          {premiumItems.map((item, i) => (
            <div
              key={i}
              className={styles.card}
              style={{ background: item.accent }}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardVisual}>
                  {/* <div className={styles.previewBox}>
                    <span className={styles.previewIcon}>◈</span>
                  </div> */}
                </div>
                <div className={styles.cardFooter}>
                  <div>
                    <div className={styles.cardTitle} style={{ color: item.lightText ? '#fff' : '#1a1a2e' }}>
                      {item.subtitle || item.title}
                    </div>
                    <div className={styles.cardCategory} style={{ color: item.lightText ? 'rgba(255,255,255,0.5)' : '#9ca3af' }}>
                      {item.category}
                    </div>
                  </div>
                  <span className={styles.price} style={{ color: item.lightText ? '#fff' : '#1a1a2e' }}>
                    {item.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}