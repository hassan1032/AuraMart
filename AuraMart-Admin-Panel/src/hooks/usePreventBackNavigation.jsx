// hooks/usePreventBackNavigation.js
import { useEffect } from "react";

const usePreventBackNavigation = () => {
  useEffect(() => {
    const tokenData = sessionStorage.getItem("data");
    const isLoggedIn = !!tokenData;

    if (isLoggedIn) {
      // 🧭 Push current page to prevent going back
      window.history.pushState(null, "", window.location.href);

      const handlePopState = () => {
        // Prevent going back
        window.history.pushState(null, "", window.location.href);
      };

      window.addEventListener("popstate", handlePopState);

      // 🧹 Cleanup on unmount
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, []);
};

export default usePreventBackNavigation;
