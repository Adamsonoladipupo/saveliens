
import { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import PageSkeleton from "./components/skeletons/PageSkeleton";
import PageError from "./components/PageError";
import {
  refreshAccessToken,
  AuthenticationError,
} from "./services/apiClient";

import TopicDetailsSkeleton from "./components/skeletons/TopicDetailsSkeleton";

function getSkeletonVariant(pathname) {
  if (pathname.startsWith("/linkspage")) {
    return "links";
  }

  if (
    pathname.startsWith("/topicspage") ||
    pathname.startsWith("/topics/")
  ) {
    return "topics";
  }

  return "dashboard";
}

export default function ProtectedRoute() {
  const location = useLocation();

  const [status, setStatus] = useState("checking");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function checkAuthentication() {
      const token = sessionStorage.getItem("token");

      if (token) {
        if (active) setStatus("authenticated");
        return;
      }

      if (active) setStatus("checking");

      try {
        await refreshAccessToken();

        if (active) {
          setStatus("authenticated");
        }
      } catch (error) {
        if (!active) return;

        if (error instanceof AuthenticationError) {
          setStatus("unauthenticated");
        } else {
          console.error(
            "Session restoration failed:",
            error
          );
          setStatus("error");
        }
      }
    }

    checkAuthentication();

    return () => {
      active = false;
    };
  }, [retryCount]);

  if (status === "checking") {
    if (location.pathname.startsWith("/topics/")) {
      return <TopicDetailsSkeleton />;
    }

    return (
      <PageSkeleton
        variant={getSkeletonVariant(location.pathname)}
      />
    );
  }

  if (status === "error") {
    return (
      <PageError
        message="We couldn't restore your session. Check your connection and try again."
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    );
  }

  if (status === "unauthenticated") {
    return (
      <Navigate
        to="/signin"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}
