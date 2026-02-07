import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        setError("");
        e.preventDefault();

        try {
            console.log("Submitting to:", route);
            console.log("Username:", username);
            
            const res = await api.post(route, { username, password });
            console.log("Login successful, received tokens");
            
            if (method === "login") {
                // Store tokens in sessionStorage first
                sessionStorage.setItem(ACCESS_TOKEN, res.data.access);
                sessionStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                console.log("Tokens stored in sessionStorage");
                console.log("ACCESS_TOKEN key:", ACCESS_TOKEN);

                // Fetch current user to determine role
                try {
                    const me = await api.get("api/user/me/");
                    console.log("Current user:", me.data.username);
                    console.log("Is superuser?", me.data.is_superuser);
                    console.log("Is staff?", me.data.is_staff);
                    
                    const isAdmin = me.data.is_superuser || me.data.is_staff;

                    if (isAdmin) {
                        console.log("Admin detected, navigating to /users");
                        navigate("/users", { replace: true });
                    } else {
                        console.log("Regular user, moving tokens to localStorage");
                        localStorage.setItem(ACCESS_TOKEN, res.data.access);
                        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                        sessionStorage.removeItem(ACCESS_TOKEN);
                        sessionStorage.removeItem(REFRESH_TOKEN);
                        navigate("/", { replace: true });
                    }
                } catch (err) {
                    console.error("Error fetching user:", err.response?.status);
                    setError("Login failed: Could not verify user role");
                    sessionStorage.removeItem(ACCESS_TOKEN);
                    sessionStorage.removeItem(REFRESH_TOKEN);
                    setLoading(false);
                }
            } else {
                alert("Registration successful! Please login.");
                navigate("/login");
                setLoading(false);
            }
        
        } catch (error) {
            console.error("API Error:", error.response?.status, error.response?.data);
            const errorMsg = error.response?.data?.detail || 
                            error.response?.data?.non_field_errors?.[0] ||
                            "Invalid username or password";
            setError(errorMsg);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            {error && <div className="error-message">{error}</div>}
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                disabled={loading}
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={loading}
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit" disabled={loading}>
                {name}
            </button>
        </form>
    );
}

export default Form;