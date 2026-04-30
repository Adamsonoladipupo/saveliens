import styles from './CTABanner.module.css';

export default function CTABanner({ variant = 'light' }) {
  return (
    <section className={`${styles.banner} ${styles[variant]}`}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logoMark}>
            <span className={styles.logoIcon}>◈</span>
            <span className={styles.logoText}>Saveliens</span>
          </div>
          <h2 className={styles.title}>
            {variant === 'dark'
              ? 'Organize powerful resources, without the chaos.'
              : 'A Simple System for Saving and Organizing Developer & Design Resources'}
          </h2>
          <a href="#" className={styles.ctaBtn}>
            {variant === 'dark' ? 'Get Started Now' : 'Browse Resources'}
          </a>
        </div>
        <div className={styles.visual}>
          <div className={styles.mockWindow}>
            <div className={styles.mockBar}>
              <span className={styles.dot} style={{ background: '#ff5f57' }} />
              <span className={styles.dot} style={{ background: '#ffbd2e' }} />
              <span className={styles.dot} style={{ background: '#28ca41' }} />
            </div>
            <div className={styles.mockContent}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={styles.mockRow}>
                  <div className={styles.mockThumb} />
                  <div className={styles.mockLines}>
                    <div className={styles.mockLine} style={{ width: `${60 + i * 8}%` }} />
                    <div className={styles.mockLine} style={{ width: `${40 + i * 5}%`, opacity: 0.4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}