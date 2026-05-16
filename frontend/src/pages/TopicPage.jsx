import React from "react";
import styles from "./Topics.module.css"
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Topics from "../components/Topics";



const TopicsPage = () => {
    const BASE_URL = "http://localhost:8080/api/dashboard";
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();

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
        .then((data)=> setDashboardData(data))
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
                <Sidebar firstName={dashboardData?.firstName}/>
                <main className={styles.main}>
                    <SearchBar />
                    <Topics topics={dashboardData?.topics} setDashboardData={setDashboardData} />
                </main>
            </div>
        </>
    )
}

export default TopicsPage;