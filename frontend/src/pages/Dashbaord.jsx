import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import HeroBoard from "../components/HeroBoard";
import StatsRow from "../components/StatsRow";
import TopicsSection from "../components/TopicSection";
import RecentLinks from "../components/RecentLinks";
import styles from "./Dashboard.module.css"
import { useNavigate } from "react-router";

const Dashboard = () =>{
    // const BASE_URL = "http://localhost:8080/api/dashboard";
    const BASE_URL=`${import.meta.env.VITE_API_BASE_URL}/api/dashboard`;
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();
    const [links, setLinks] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/signin");
            return <h1>Loading Empty token ...</h1> ;
        }

        fetch(`${BASE_URL}/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
        }
        })
        .then((response)=> 
        {
            if (!response.ok) {
                throw new Error("Unauthorized");
            }
            return response.json();
            
        })
        .then((data)=> {
            setDashboardData(data)
            setLinks(data.recentlyAddedLinks || []);
        })
        .catch((error) => {
            console.log(error);
            // sessionStorage.removeItem("token");
            // sessionStorage.removeItem("email");
            navigate("/signin");
        });
    }, []);
    if(!dashboardData){
        return <h1>Loading ...</h1>
    }

    return (
        <>
            <div className={styles.layout}>
                <Sidebar firstName={dashboardData?.firstName} setDashboardData={setDashboardData}/>
                <main className={styles.main}>
                    <SearchBar />
                    <HeroBoard 
                        topics={dashboardData?.topics}
                        setDashboardData={setDashboardData}
                    />
                    <StatsRow 
                        totalTopics={dashboardData?.totalTopics} 
                        totalLinks={dashboardData?.totalLinks}
                    />
                    
                    <TopicsSection topics={dashboardData?.topics} setDashboardData={setDashboardData} />
                    <RecentLinks links={links} setLinks={setLinks} setDashboardData={setDashboardData}/>
                </main>
            </div>
        </>
    );
}
export default Dashboard