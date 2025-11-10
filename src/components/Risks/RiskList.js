import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Edit2, Trash2, PlusCircle } from "lucide-react";
import { getToken } from "../../utils/auth";

export default function RiskList() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const history = useHistory();

  const API_URL = "https://cftoolbackend.duckdns.org/api/risks";

  const fetchRisks = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch risks");
      const data = await res.json();
      setRisks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch risks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this risk?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setRisks((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Error deleting risk");
    }
  };

  useEffect(() => {
    fetchRisks();
  }, []);

  const filteredRisks = risks.filter((r) =>
    [r.riskId, r.riskDescription, r.department, r.riskType, r.riskLevel]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading risks...</p>
      </div>
    );

  if (error)
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
        {error}
      </p>
    );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", marginLeft: "200px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2>All Risks</h2>
        <button
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
          }}
          onClick={() => history.push("/risks/create")}
        >
          <PlusCircle size={18} /> Add Risk
        </button>
      </div>

      <input
        type="text"
        placeholder="Search risks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#d9edf7", textAlign: "left" }}>
              <th style={styles.th}>Risk ID</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Risk Type</th>
              <th style={styles.th}>Risk Level</th>
              <th style={styles.th}>Risk Score</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRisks.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "12px" }}>
                  No risks found.
                </td>
              </tr>
            ) : (
              filteredRisks.map((r, index) => (
                <tr
                  key={r._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fff" : "#f3f3f3",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e6f7ff")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#fff" : "#f3f3f3")
                  }
                >
                  <td style={styles.td}>{r.riskId}</td>
                  <td style={styles.td}>{r.riskDescription}</td>
                  <td style={styles.td}>{r.department}</td>
                  <td style={styles.td}>{r.riskType}</td>
                  <td style={styles.td}>{r.riskLevel}</td>
                  <td style={styles.td}>{r.riskScore}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.iconButton}
                      onClick={() => history.push(`/risks/edit/${r._id}`)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      style={{ ...styles.iconButton, color: "#dc2626" }}
                      onClick={() => handleDelete(r._id)}
                    >
                      <Trash2 size={16} />
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

const styles = {
  th: { padding: "10px", border: "1px solid #ccc" },
  td: { padding: "10px", border: "1px solid #ccc" },
  iconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    marginRight: 8,
    color: "#2563eb",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9fafb",
    marginLeft: "200px",
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
};

// Spinner keyframes
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }",
  styleSheet.cssRules.length
);
