import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const endpoint = "http://localhost:3213/api/t1/users";
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", nrp: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    const responses = await fetch(endpoint);
    const data = await responses.json();
    setUsers(data.data);
  };

  const addUser = async () => {
    if (!form.username || !form.nrp) return;
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ username: "", nrp: "" });
    fetchUsers();
  };

  const updateUser = async (id) => {
    if (!form.username || !form.nrp) return;
    await fetch(`${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ username: "", nrp: "" });
    setEditingUser(null);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      fetchUsers();
    }
  };

  const editUser = (user) => {
    setEditingUser(user.id);
    setForm({ username: user.username, nrp: user.nrp });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setForm({ username: "", nrp: "" });
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nrp.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { title: "Total Users", value: users.length, icon: "👥", color: "#3b82f6" },
    { title: "Total Records", value: users.length * 3, icon: "📊", color: "#f59e0b" }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>📊 Admin Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <span className="nav-icon">👥</span>
            User Management
          </a>

        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div>
            <h1>User Management System</h1>
            <p className="header-subtitle">Manage your users efficiently</p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit User Form */}
        <div className="form-container">
          <div className="form-header">
            <h2>{editingUser ? '✏️ Edit User' : '➕ Add New User'}</h2>
          </div>
          <div className="form-content">
            <div className="form-row">
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="form-input"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>NRP</label>
                <input
                  type="text"
                  placeholder="Enter NRP"
                  className="form-input"
                  value={form.nrp}
                  onChange={(e) => setForm({ ...form, nrp: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              {editingUser ? (
                <>
                  <button className="btn-primary" onClick={() => updateUser(editingUser)}>
                    💾 Update User
                  </button>
                  <button className="btn-secondary" onClick={cancelEdit}>
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <button className="btn-primary" onClick={addUser}>
                  ➕ Add User
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-container">
          <div className="table-header">
            <h2>📋 Users List ({filteredUsers.length})</h2>
            <div className="table-controls">
              <input 
                type="search" 
                placeholder="Search users..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>NRP</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user.id} className={editingUser === user.id ? 'editing' : ''}>
                    <td>
                      <div className="user-id">#{user.id}</div>
                    </td>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.username}</span>
                      </div>
                    </td>
                    <td>
                      <span className="nrp-badge">{user.nrp}</span>
                    </td>
                    <td>
                      <span className="status-badge active">Active</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon edit"
                          onClick={() => editUser(user)}
                          title="Edit user"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon delete"
                          onClick={() => deleteUser(user.id)}
                          title="Delete user"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      {searchTerm ? '🔍 No users found matching your search' : '📭 No users available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
