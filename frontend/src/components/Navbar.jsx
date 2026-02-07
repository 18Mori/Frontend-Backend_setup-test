import { useNavigate } from "react-router-dom";
import api from "../api";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      backgroundColor: "#007bfff4",
      color: "white"
    }}>
      <h2>Dashboard</h2>
      <button 
        onClick={handleLogout}
        style={{
          padding: "8px 15px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;