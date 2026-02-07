import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

function ProtectedRoute({ children, adminOnly = false }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = async () => {
      // Checks sessionStorage first then localStorage
      const sessionToken = sessionStorage.getItem(ACCESS_TOKEN);
      const localToken = localStorage.getItem(ACCESS_TOKEN) || localStorage.getItem("access");
      const token = sessionToken || localToken;

      console.log("ProtectedRoute check - Token exists?", !!token);
      console.log("From sessionStorage?", !!sessionToken);
      console.log("From localStorage?", !!localToken);
      console.log("AdminOnly required?", adminOnly);

      if (!token) {
        console.log("No token found, redirecting to login");
        setAllowed(false);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("api/user/me/");
        console.log("User check - Username:", res.data.username);
        console.log("Is superuser?", res.data.is_superuser);
        console.log("Is staff?", res.data.is_staff);

        const userIsAdmin = res.data.is_superuser || res.data.is_staff;

        if (adminOnly) {
          if (userIsAdmin) {
            console.log("Admin access granted");
            setAllowed(true);
          } else {
            console.log("Non-admin redirecting to /");
            setAllowed(false);
            // Redirect normal users to home
            setTimeout(() => {
              window.location.href = "/";
            }, 500);
          }
        } else {
          console.log("Regular access granted");
          setAllowed(true);
        }
      } catch (err) {
        console.error("Error fetching user:", err.response?.status, err.message);
        console.error("   Response:", err.response?.data);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [adminOnly]);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#666"
      }}>
        Loading...
      </div>
    );
  }

  if (!allowed) {
    console.log("Access denied, returning to login");
    return <Navigate to="/login" replace />;
  }

  console.log("Rendering protected content");
  return children;
}

export default ProtectedRoute;