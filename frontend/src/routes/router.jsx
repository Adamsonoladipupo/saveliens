import React from "react";
import { createBrowserRouter } from "react-router";

import Header from "../components/Header";
import LandingPage from "../pages/landingPage";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Dashboard from "../pages/Dashbaord";
import Topics from "../pages/TopicPage";
import LinksPage from "../pages/LinksPage";
import TopicDetails from "../components/TopicDetails";
import OAuthCallback from "../pages/OAuthCallback";

import ProtectedRoute from "../../src/ProtectedRoute";

import Settings from "../pages/Settings";

import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

const Router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/header",
    element: <Header />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/oauth/callback",
    element: <OAuthCallback />,
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/topicspage",
        element: <Topics />,
      },
      {
        path: "/linkspage",
        element: <LinksPage />,
      },
      {
        path: "/topics/:topicId",
        element: <TopicDetails />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);

export default Router;