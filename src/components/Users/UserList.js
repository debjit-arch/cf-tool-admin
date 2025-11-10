import React, { Component } from "react";
import API from "../../api/api";
import { Link } from "react-router-dom";

class UserList extends Component {
  state = {
    users: [],
    loading: true,
    error: "",
    success: "",
    searchTerm: "", // <-- for search
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    try {
      const { data } = await API.get("/");
      const users = data.map((u) => ({
        ...u,
        departmentName: u.departmentName || "-",
      }));
      this.setState({ users, loading: false, error: "", success: "" });
    } catch (err) {
      this.setState({
        error: err.response?.data?.error || "Failed to fetch users",
        loading: false,
        success: "",
      });
    }
  };

  handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/${id}`);
      this.setState({ success: "User deleted successfully!" });
      this.fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  render() {
    const { users, loading, error, success, searchTerm } = this.state;

    // Filter users based on search term
    const filteredUsers = users.filter((u) =>
      [u.name, u.email, u.role, u.departmentName]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    if (loading)
      return (
        <div style={styles.loaderContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading users...</p>
        </div>
      );

    if (error)
      return (
        <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
          {error}
        </p>
      );

    return (
      <div
        style={{
          padding: "20px",
          maxWidth: "900px",
          margin: "auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Users</h2>

        {success && (
          <div
            style={{
              backgroundColor: "#dff0d8",
              color: "#3c763d",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
            }}
          >
            {success}
          </div>
        )}

        {/* Add User Button */}
        <Link
          style={{
            display: "inline-block",
            marginBottom: "15px",
            padding: "8px 16px",
            backgroundColor: "#5cb85c",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
          }}
          to="/users/create"
        >
          Add User
        </Link>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={this.handleSearchChange}
          style={{
            width: "100%",
            padding: "8px 12px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        />

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#d9edf7", textAlign: "left" }}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "12px" }}
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr
                    key={u._id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#fff" : "#f3f3f3",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e6f7ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        index % 2 === 0 ? "#fff" : "#f3f3f3")
                    }
                  >
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>{u.role}</td>
                    <td style={styles.td}>{u.departmentName}</td>
                    <td style={styles.td}>
                      <Link style={styles.editBtn} to={`/users/edit/${u._id}`}>
                        Edit
                      </Link>
                      <button
                        onClick={() => this.handleDelete(u._id)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const styles = {
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9fafb",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "6px solid #ddd",
    borderTop: "6px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: { marginTop: "15px", color: "#374151", fontWeight: "500" },
  th: { padding: "10px", border: "1px solid #ccc" },
  td: { padding: "10px", border: "1px solid #ccc" },
  editBtn: {
    marginRight: "10px",
    padding: "5px 12px",
    backgroundColor: "#5bc0de",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    textDecoration: "none",
  },
  deleteBtn: {
    padding: "5px 12px",
    backgroundColor: "#d9534f",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
};

// Add spinner keyframes
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }",
  styleSheet.cssRules.length
);

export default UserList;
