import styles from './PersonalLibrary.module.css';

export default function PersonalLibrary() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.textContent}>
          <h2 className={styles.title}>
            Unlock your personal library<br />of saved resources.
          </h2>
          <p className={styles.desc}>
            Saveliens is your personal library for saved links and resources. Organize
            everything you discover online in one place.
          </p>
          <a href="#" className={styles.learnMore}>Learn more →</a>
        </div>
        <div className={styles.deco}>
          <div className={styles.decoOrb} />
          <div className={styles.decoOrb2} />
        </div>
      </div>
    </section>
  );
}