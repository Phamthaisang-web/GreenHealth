import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeaderLayout() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");

  const name = user ? JSON.parse(user).name : "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <div style={styles.header}>
      <div style={styles.logo}>
        <h2 style={{ margin: 0 }}>MyApp</h2>
      </div>

      <div style={styles.right}>
        {token ? (
          <>
            <span style={styles.username}>Xin chào, {name}</span>

            <button style={styles.logoutBtn} onClick={handleLogout}>
              Đăng xuất
            </button>
          </>
        ) : (
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            style={styles.avatar}
            onClick={() => navigate("/login")}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    height: "60px",
    backgroundColor: "#1976d2",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    color: "white",
  },

  logo: {
    fontWeight: "bold",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  username: {
    fontWeight: "500",
  },

  logoutBtn: {
    background: "white",
    color: "#1976d2",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
    border: "2px solid white",
  },
};
