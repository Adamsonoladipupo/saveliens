import React from "react"
import { createBrowserRouter, Links } from "react-router"
import Header from "../components/Header"
import LandingPage from "../pages/landingPage"
import SignUp from "../pages/SignUp"
import SignIn from "../pages/SignIn"
import Dashboard from "../pages/Dashbaord"
import Topics from "../pages/TopicPage"
import LinksPage from "../pages/LinksPage"
import TopicDetails from "../components/TopicDetails"
const Router = createBrowserRouter ([
    {
        path : "header",
        element:<Header/>
    },
    {
        path: "/",
        element:<LandingPage/>
    },
    {
        path:"signup",
        element:<SignUp/>
    },
    {
        path:"signin",
        element:<SignIn/>
    },
    {
        path: "dashboard",
        element: <Dashboard/>
    },
    {
        path: "topicspage",
        element: <Topics />
    },
    {
        path: "linkspage",
        element: <LinksPage />
    },
    {
        path:"/topics/:topicId",
        element:<TopicDetails />
    }
])
export default Router 