import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Sidebar from "../components/Sidebar";
import LinkRow from "../components/LinkRow";
import styles from "./TopicDetails.module.css";

export default function TopicDetails() {

  const { topicId } = useParams();

  const [topic, setTopic] = useState(null);

  const [links, setLinks] = useState([]);

  useEffect(() => {

    const token = sessionStorage.getItem("token");

    fetch(
      `http://localhost:8080/api/topic/${topicId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.json())
    // .then((data) => setTopic(data))
    .then((data) => {
      setTopic({
        title: data.title,
        description: data.description,
        firstName: data.firstName,
      });

      setLinks(data.links);
    })
    .catch((error) => console.log(error));

  }, [topicId]);

  if (!topic) {
    return <h3>Loading...</h3>;
  }


  return (

    <div className={styles.layout}>

      <Sidebar  firstName={topic.firstName}/>

      <main className={styles.main}>

        <h1 className={styles.title}>
          {topic.title}
        </h1>
        <p>
            {topic.description}
        </p>

        <div className={styles.list}>

          {/* {topic.links.map((link) => (

            <LinkRow
              key={link.id}
              {...link}
              setLinks={setLinks}
            />

          ))} */}
          {links.map((link) => (
            <LinkRow
              key={link.id}
              {...link}
              setLinks={setLinks}
            />
          ))}
          

        </div>

      </main>

    </div>
  );
}