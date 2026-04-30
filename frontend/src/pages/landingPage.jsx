import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ResourceGrid from "../components/ResourceGrid";
import CTABanner from "../components/CTABanner";
import PremiumResources from "../components/PremiumResources";
import PersonalLibrary from "../components/PersonalLibrary";
import Blog from "../components/Blog";
import Footer from "../components/Footer";

const LandingPage = () => {
    return (
        <>
            <Header/>
            <Hero/>
            {/* <ResourceGrid/> */}
            <CTABanner/>
            <PremiumResources/>
            <PersonalLibrary/>
            <Blog/>
            <Footer/>
        </>
    );
} 
export default LandingPage