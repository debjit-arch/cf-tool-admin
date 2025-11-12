import React, { useState, useEffect } from "react";
import API from "../../api/api";

export default function UserForm({ userToEdit = null, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "risk_identifier",
    department: null,
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false); // <-- Add loading state
  const roles = [
    "super_admin",
    "risk_owner",
    "risk_manager",
    "risk_identifier",
  ];

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await API.get("/departments");
        setDepartments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (userToEdit && departments.length > 0) {
      const dept =
        departments.find((d) => d._id === userToEdit.department?._id) || null;
      setFormData({
        name: userToEdit.name || "",
        email: userToEdit.email || "",
        password: "",
        role: userToEdit.role || "risk_identifier",
        department: dept,
      });
    }
  }, [userToEdit, departments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeptChange = (e) => {
    const selectedDept =
      departments.find((d) => d._id === e.target.value) || null;
    setFormData((prev) => ({ ...prev, department: selectedDept }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // <-- start loading

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        departmentId:
          formData.role !== "super_admin"
            ? formData.department?._id || null // send just the _id
            : null,
      };
      console.log(formData);
      if (!userToEdit) payload.password = formData.password;

      if (userToEdit) {
        await API.put(`/${userToEdit._id}`, payload);
        alert("User updated successfully!");
      } else {
        await API.post("/", payload);
        alert("User created successfully!");
      }

      onSuccess && onSuccess();
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "risk_identifier",
        department: null,
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save user");
    } finally {
      setLoading(false); // <-- stop loading
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>
        {userToEdit ? "Update User" : "Create User"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
            style={styles.input}
          />
        </div>

        {/* Email */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
            style={styles.input}
          />
        </div>

        {/* Password */}
        {!userToEdit && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              style={styles.input}
            />
          </div>
        )}

        {/* Role */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.input}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        {formData.role !== "super_admin" && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Department</label>
            <select
              name="department"
              value={formData.department?._id || ""}
              onChange={handleDeptChange}
              required
              style={styles.input}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" style={styles.primaryBtn} disabled={loading}>
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <div style={styles.spinner}></div>
              <span>{userToEdit ? "Updating..." : "Creating..."}</span>
            </div>
          ) : userToEdit ? (
            "Update User"
          ) : (
            "Create User"
          )}
        </button>
      </form>
    </div>
  );
}

// Spinner and styles
const styles = {
  card: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "25px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "25px",
    fontWeight: 600,
    color: "#111827",
    fontSize: "1.4rem",
  },
  formGroup: {
    marginBottom: "18px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "6px",
    fontWeight: 500,
    color: "#374151",
    fontSize: "0.95rem",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "0.95rem",
    outline: "none",
    transition: "0.2s",
    background: "#fff",
  },
  primaryBtn: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: 500,
    fontSize: "15px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid #fff",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

// Spinner keyframes (add at the bottom of file)
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  "@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }",
  styleSheet.cssRules.length
);
