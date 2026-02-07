import { useState, useEffect } from "react";
import api from "../api";
import "./UsersTable.css";
import Navbar from "./Navbar";

function UsersTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            console.log("Fetching users from /api/users/");

            const res = await api.get("api/users/");
            console.log("Users fetched successfully:", res.data);
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error.response?.data || error.message);
            alert("Failed to fetch users: " + (error.response?.status || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`api/users/delete/${userId}/`);
                setUsers(users.filter(user => user.id !== userId));
                alert("User deleted successfully");
            } catch (error) {
                alert("Failed to delete user");
                console.error(error);
            }
        }
    };

    const handleViewDetails = (user) => {
        console.log("Viewing details for:", user);
        setSelectedUser(user);
    };

    const closeModal = () => {
        setSelectedUser(null);
    };

    return (
        <>
            <Navbar />
            <div className="users-container">
                <h1>Admin Dashboard - Users Management</h1>
                {loading && <div className="loading">Loading users...</div>}
                {users.length === 0 && !loading ? (
                    <p>No users found</p>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Inactive Time</th>
                                <th>Notes</th>
                                <th>Registered</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className={user.is_currently_active ? "active-row" : "inactive-row"}>
                                    <td>{user.id}</td>
                                    <td><strong>{user.username}</strong></td>
                                    <td>{user.email || "N/A"}</td>
                                    <td>
                                        <span className={`status-badge ${user.is_currently_active ? "active" : "inactive"}`}>
                                            {user.is_currently_active ? "🟢 Active" : "🔴 Inactive"}
                                        </span>
                                    </td>
                                    <td className="time-cell">{user.inactive_duration}</td>
                                    <td>
                                        <span className="notes-badge">{user.notes_count}</span>
                                    </td>
                                    <td className="date-cell">{user.registration_date || "N/A"}</td>
                                    <td className="date-cell">{user.last_login_display}</td>
                                    <td>
                                        <button 
                                            className="btn-view"
                                            onClick={() => handleViewDetails(user)}
                                        >
                                            View
                                        </button>
                                        <button 
                                            className="btn-delete"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {selectedUser && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close-btn" onClick={closeModal}>✕</button>
                            <h2>User Details - {selectedUser.username}</h2>
                            
                            <div className="user-info-section">
                                <h3>Account Information</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <strong>ID:</strong> {selectedUser.id}
                                    </div>
                                    <div className="info-item">
                                        <strong>Username:</strong> {selectedUser.username}
                                    </div>
                                    <div className="info-item">
                                        <strong>Email:</strong> {selectedUser.email || "N/A"}
                                    </div>
                                    <div className="info-item">
                                        <strong>Status:</strong> 
                                        <span className={`status-badge ${selectedUser.is_currently_active ? "active" : "inactive"}`}>
                                            {selectedUser.is_currently_active ? "🟢 Active" : "🔴 Inactive"}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <strong>Registered:</strong> {selectedUser.registration_date || "N/A"}
                                    </div>
                                    <div className="info-item">
                                        <strong>Last Login:</strong> {selectedUser.last_login_display}
                                    </div>
                                </div>
                            </div>

                            <div className="notes-section">
                                <h3>Notes ({selectedUser.notes_count || 0})</h3>
                                {!selectedUser.notes || selectedUser.notes.length === 0 ? (
                                    <p className="no-notes">No notes created</p>
                                ) : (
                                    <div className="notes-list">
                                        {selectedUser.notes.map((note, index) => (
                                            <div key={note.id} className="note-item">
                                                <div className="note-header">
                                                    <h4>#{index + 1} - {note.title}</h4>
                                                    <small>{new Date(note.created_at).toLocaleString()}</small>
                                                </div>
                                                <p className="note-content">{note.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button className="btn-close" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default UsersTable;