import React from "react";
import { useHistory } from "react-router-dom";
import { Users, Building2, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const history = useHistory();

  const tiles = [
    {
      label: "Users",
      icon: <Users size={28} />,
      color: "#2563eb",
      path: "/users",
    },
    {
      label: "Departments",
      icon: <Building2 size={28} />,
      color: "#10b981",
      path: "/departments",
    },
    {
      label: "Risks",
      icon: <ShieldCheck size={28} />,
      color: "#f59e0b",
      path: "/risks",
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Dashboard</h1>
      <div style={styles.grid}>
        {tiles.map((tile) => (
          <div
            key={tile.label}
            style={{ ...styles.card, borderTop: `5px solid ${tile.color}` }}
            onClick={() => history.push(tile.path)}
          >
            <div style={styles.iconWrapper}>{tile.icon}</div>
            <h2 style={styles.cardTitle}>{tile.label}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    marginLeft: "200px", // adjust for sidebar width
    fontFamily: "Inter, system-ui, sans-serif",
  },
  heading: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "2rem 1rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  iconWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "1rem",
    color: "#374151",
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "500",
    color: "#111827",
  },
};
