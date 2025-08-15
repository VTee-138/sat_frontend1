import React, { useState, useEffect } from "react";
import logo from "../images/logo.png";
import { getUserInfo } from "../services/AuthService";

export default function LogoGridBackground({ contained = false }) {
  const rows = 6;
  const cols = 7;
  const images = [];
  const [userInfo, setUserInfo] = useState(null);
  const userName = userInfo?.fullName || "";
  const userEmail = userInfo?.email || "";

  useEffect(() => {
    const loadUserInfo = () => {
      const user = getUserInfo();
      setUserInfo(user);
    };

    loadUserInfo();

    // Lắng nghe sự thay đổi của localStorage (từ tab khác)
    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === "jwt") {
        loadUserInfo();
      }
    };

    // Lắng nghe custom event userLogout
    const handleUserLogout = () => {
      setUserInfo(null);
    };

    // Lắng nghe custom event userInfoChanged
    const handleUserInfoChanged = () => {
      loadUserInfo();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLogout", handleUserLogout);
    window.addEventListener("userInfoChanged", handleUserInfoChanged);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLogout", handleUserLogout);
      window.removeEventListener("userInfoChanged", handleUserInfoChanged);
    };
  }, []);

  for (let i = 0; i < rows * cols; i++) {
    images.push(
      <div
        key={i}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: 8,
          userSelect: "none",
          pointerEvents: "none",
          transform: "rotate(-20deg)",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: 100,
            opacity: 0.08,
            display: "block",
          }}
        />
        {userName && (
          <div
            style={{
              fontSize: "14px",
              color: "#333",
              opacity: 0.12,
              marginTop: 4,
              textAlign: "center",
              whiteSpace: "nowrap",
              fontWeight: 600,
              width: "100%",
            }}
          >
            {userName}
          </div>
        )}
        {userEmail && (
          <div
            style={{
              fontSize: "14px",
              color: "#333",
              opacity: 0.08,
              marginTop: 2,
              textAlign: "center",
              whiteSpace: "nowrap",
              fontWeight: 400,
              width: "100%",
            }}
          >
            {userEmail}
          </div>
        )}
      </div>
    );
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        justifyItems: "center",
        alignItems: "center",
        width: contained ? "100%" : "100vw",
        minHeight: contained ? "100%" : "100vh",
        background: "#fff",
        position: contained ? "absolute" : "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {images}
    </div>
  );
}
