import React from "react";

import styles from "./Links.module.css";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router";

import Sidebar from "../components/Sidebar";

import SearchBar from "../components/SearchBar";

import Links from "../components/Links";

const LinksPage = () => {

    const BASE_URL =
        "http://localhost:8080/api/dashboard";

    const [dashboardData, setDashboardData] =
        useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        const token =
            sessionStorage.getItem("token");

        if (!token) {

            navigate("/signin");

            return;

        }

        fetch(`${BASE_URL}/me`, {

            method: "GET",

            headers: {

                Authorization: `Bearer ${token}`,

                "Content-Type": "application/json",

            },

        })

        .then((response) => {

            if (!response.ok) {

                throw new Error("Unauthorized");

            }

            return response.json();

        })

        .then((data) => {

            setDashboardData(data);

        })

        .catch((error) => {

            console.log(error);

            navigate("/signin");

        });

    }, []);

    if (!dashboardData) {

        return <h1>Loading...</h1>;

    }

    return (

        <div className={styles.layout}>

            <Sidebar
                firstName={dashboardData?.firstName}
            />

            <main className={styles.main}>

                <SearchBar />

                <Links
                    links={dashboardData?.recentlyAddedLinks}
                    setDashboardData={setDashboardData}
                />

            </main>

        </div>

    );

};

export default LinksPage;