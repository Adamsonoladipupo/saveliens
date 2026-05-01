import React from "react";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import HeroBoard from "../components/HeroBoard";
import StatsRow from "../components/StatsRow";
import TopicsSection from "../components/TopicSection";
import RecentLinks from "../components/RecentLinks";
import styles from "./Dashboard.module.css"

const Dashboard = () =>{
    return (
        <>
            <div className={styles.layout}>
                <Sidebar />
                <main className={styles.main}>
                    <SearchBar />
                    <HeroBoard />
                    <StatsRow />
                    <TopicsSection />
                    <RecentLinks />
                </main>
            </div>
        </>
    );
}
export default Dashboard