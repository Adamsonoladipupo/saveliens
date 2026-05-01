import React from "react"
import { createBrowserRouter } from "react-router"
import Header from "../components/Header"
import LandingPage from "../pages/landingPage"
import SignUp from "../pages/SignUp"
import SignIn from "../pages/SignIn"
import Dashboard from "../pages/Dashbaord"
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
    }
])
export default Router 