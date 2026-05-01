import styles from './RecentLinks.module.css';
import LinkRow from './LinkRow';

const links = [
  {
    id: 1,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80',
    title: 'Link Title',
    date: '25/2/2023',
    topic: 'Understanding Concept Of React',
    topicLabel: 'TOPIC',
  },
  {
    id: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
    title: 'Link Title',
    date: '25/2/2023',
    topic: 'Understanding Concept Of React',
    topicLabel: 'TOPIC',
  },
  {
    id: 3,
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&q=80',
    title: 'Link Title',
    date: '26/2/2023',
    topic: 'Advanced CSS Techniques',
    topicLabel: 'TOPIC',
  },
];

export default function RecentLinks() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Recently Added Links</h2>
        <a href="#" className={styles.seeAll}>See All</a>
      </div>
      <div className={styles.list}>
        {links.map((link) => (
          <LinkRow key={link.id} {...link} />
        ))}
      </div>
    </section>
  );
}