import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getToken } from "../../utils/auth";

export default function RiskForm() {
  const { id } = useParams(); // if editing
  const history = useHistory();

  const API_URL = "https://cftoolbackend.duckdns.org/api/risks";

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    riskId: "",
    riskDescription: "",
    department: "",
    riskType: "Strategic",
    riskLevel: "Low",
    riskScore: 0,
    asset: "",
    assetType: "Private",
    confidentiality: 1,
    integrity: 1,
    availability: 1,
    additionalControls: "",
    additionalNotes: "",
    existingControls: "",
    status: "Active",
    deadlineDate: "",
  });

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await fetch(
        "https://cftoolbackend.duckdns.org/api/departments",
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  // Fetch risk if editing
  const fetchRisk = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setFormData({
        riskId: data.riskId || "",
        riskDescription: data.riskDescription || "",
        department: data.department || "",
        riskType: data.riskType || "Strategic",
        riskLevel: data.riskLevel || "Low",
        riskScore: data.riskScore || 0,
        asset: data.asset || "",
        assetType: data.assetType || "Private",
        confidentiality: data.confidentiality || 1,
        integrity: data.integrity || 1,
        availability: data.availability || 1,
        additionalControls: data.additionalControls || "",
        additionalNotes: data.additionalNotes || "",
        existingControls: data.existingControls || "",
        status: data.status || "Active",
        deadlineDate: data.deadlineDate ? data.deadlineDate.split("T")[0] : "",
      });
    } catch (err) {
      console.error("Failed to fetch risk:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
    if (id) fetchRisk();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateRiskScore = () => {
    const { confidentiality, integrity, availability } = formData;
    const score =
      Number(confidentiality) + Number(integrity) + Number(availability);
    setFormData((prev) => ({ ...prev, riskScore: score }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `${API_URL}/${id}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save risk");
      history.push("/risks");
    } catch (err) {
      console.error(err);
      alert("Error saving risk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", marginLeft: "200px" }}>
      <h2>{id ? "Edit Risk" : "Add Risk"}</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <div style={styles.group}>
          <label>Risk ID</label>
          <input
            name="riskId"
            value={formData.riskId}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.group}>
          <label>Risk Description</label>
          <textarea
            name="riskDescription"
            value={formData.riskDescription}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>

        <div style={styles.group}>
          <label>Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d._id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.group}>
          <label>Risk Type</label>
          <select
            name="riskType"
            value={formData.riskType}
            onChange={handleChange}
            style={styles.input}
          >
            <option>Strategic</option>
            <option>Operational</option>
            <option>Compliance</option>
            <option>Financial</option>
          </select>
        </div>

        <div style={styles.group}>
          <label>Risk Level</label>
          <select
            name="riskLevel"
            value={formData.riskLevel}
            onChange={handleChange}
            style={styles.input}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div style={styles.group}>
          <label>Asset</label>
          <input
            name="asset"
            value={formData.asset}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.group}>
          <label>Asset Type</label>
          <select
            name="assetType"
            value={formData.assetType}
            onChange={handleChange}
            style={styles.input}
          >
            <option>Private</option>
            <option>Public</option>
          </select>
        </div>

        <div style={styles.group}>
          <label>Confidentiality</label>
          <input
            type="number"
            name="confidentiality"
            value={formData.confidentiality}
            onChange={(e) => {
              handleChange(e);
              calculateRiskScore();
            }}
            min="1"
            max="5"
            style={styles.input}
          />
        </div>

        <div style={styles.group}>
          <label>Integrity</label>
          <input
            type="number"
            name="integrity"
            value={formData.integrity}
            onChange={(e) => {
              handleChange(e);
              calculateRiskScore();
            }}
            min="1"
            max="5"
            style={styles.input}
          />
        </div>

        <div style={styles.group}>
          <label>Availability</label>
          <input
            type="number"
            name="availability"
            value={formData.availability}
            onChange={(e) => {
              handleChange(e);
              calculateRiskScore();
            }}
            min="1"
            max="5"
            style={styles.input}
          />
        </div>

        <div style={styles.group}>
          <label>Risk Score</label>
          <input
            name="riskScore"
            value={formData.riskScore}
            readOnly
            style={styles.input}
          />
        </div>

        <div style={styles.group}>
          <label>Existing Controls</label>
          <textarea
            name="existingControls"
            value={formData.existingControls}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        <div style={styles.group}>
          <label>Additional Controls</label>
          <textarea
            name="additionalControls"
            value={formData.additionalControls}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        <div style={styles.group}>
          <label>Additional Notes</label>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        <div style={styles.group}>
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={styles.input}
          >
            <option>Active</option>
            <option>Closed</option>
          </select>
        </div>

        <div style={styles.group}>
          <label>Deadline Date</label>
          <input
            type="date"
            name="deadlineDate"
            value={formData.deadlineDate}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.submitButton}>
          {loading ? "Saving..." : "Save Risk"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  group: { marginBottom: "1rem", display: "flex", flexDirection: "column" },
  input: { padding: "8px", borderRadius: "6px", border: "1px solid #ccc" },
  textarea: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minHeight: "60px",
  },
  submitButton: {
    background: "#2563eb",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
};
