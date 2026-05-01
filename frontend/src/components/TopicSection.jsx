import styles from './TopicsSection.module.css';
import TopicCard from './TopicCard';

const topics = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
    title: 'Brief Topic Description, What Does The Topic Entails, The Kind Of Links Contains.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80',
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=400&q=80',
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
  },
];

export default function TopicsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Topics</h2>
        <a href="#" className={styles.seeAll}>See All</a>
      </div>
      <div className={styles.grid}>
        {topics.map((topic) => (
          <TopicCard key={topic.id} {...topic} />
        ))}
      </div>
    </section>
  );
}