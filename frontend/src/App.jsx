import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
// import Notfound from "./pages/Notfound"
import ProtectedRoute from "./components/ProtectedRoute"
import UsersTable from "./components/UsersTable";

function Logout() {
  localStorage.clear()
  sessionStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  sessionStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute adminOnly={false}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute adminOnly={true}>
              <UsersTable />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        {/* <Route path="*" element={<Notfound />}></Route> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
