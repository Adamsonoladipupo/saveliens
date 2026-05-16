import styles from './RecentLinks.module.css';
import LinkRow from './LinkRow';
import { Link } from 'react-router';

export default function RecentLinks({links, setLinks, setDashboardData}) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Recently Added Links</h2>
        <Link to={"/linkspage"} className={styles.seeAll}>See All</Link>
      </div>
      <div className={styles.list}>
        {links.slice(0,5).map((link) => (
          <LinkRow 
            key={link.id}
            id={link.id}
            url={link.url}
            topicId={link.topicId}
            topicTitle={link.topicTitle}
            setLinks={setLinks} 
            setDashboardData={setDashboardData}
          />
        ))}
      </div>
    </section>
  );
}