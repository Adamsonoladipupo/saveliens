import styles from './TopicsSection.module.css';
import TopicCard from './TopicCard';
import { Link } from 'react-router';
import TopicsPage from '../pages/TopicPage';


export default function TopicsSection({topics, setDashboardData}) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Topics</h2>
        <Link to={"/topicspage"} className={styles.seeAll}>See All</Link>
      </div>

      <div className={styles.grid}>
        {topics.length > 0 ? (

          topics.slice(0, 3).map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              setDashboardData={setDashboardData}  
            />
          ))

        ) : (

          <p className={styles.empty}>
            No topics available yet.
          </p>

        )}

      </div>
    </section>
  );
}