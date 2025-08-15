import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ExamCompletedPage() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get("assessmentId");

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleViewScore = () => {
    navigate("/score-details" + (assessmentId ? `/${assessmentId}` : ""));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={250}
        recycle={false}
        style={{ position: "fixed", top: 0, left: 0, zIndex: 1 }}
      />
      <div
        style={{
          zIndex: 2,
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          animation: "fadeInUp 0.8s ease-out",
        }}
      >
        <h1
          style={{
            color: "black",
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 900,
            marginBottom: 40,
            marginTop: 0,
            textAlign: "center",
            letterSpacing: "1.5px",
          }}
        >
          🎉 {t("exam.examCompleted")} 🎉
        </h1>
        <div
          style={{
            background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
            borderRadius: 24,
            boxShadow:
              "0 20px 60px rgba(24,30,90,0.15), 0 8px 20px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "40px",
            width: "100%",
            marginBottom: 40,
            gap: 30,
            position: "relative",
            border: "1px solid rgba(255,255,255,0.2)",
            transition: "all 0.3s ease",
            cursor: "default",
            maxWidth: "540px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 25px 70px rgba(24,30,90,0.2), 0 10px 25px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 20px 60px rgba(24,30,90,0.15), 0 8px 20px rgba(0,0,0,0.1)";
          }}
        >
          <div
            style={{
              flex: "0 0 120px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                borderRadius: "50%",
                padding: "12px",
                boxShadow: "0 8px 25px rgba(255,215,0,0.3)",
                animation: "pulse 2s infinite",
              }}
            >
              <svg
                width="96"
                height="96"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="120" height="120" rx="28" fill="#F5F7FB" />
                <rect
                  x="20"
                  y="32"
                  width="80"
                  height="56"
                  rx="12"
                  fill="#E3EAFD"
                />
                <rect x="32" y="44" width="56" height="32" rx="8" fill="#fff" />
                <circle cx="60" cy="60" r="18" fill="#E3EAFD" />
                <circle cx="60" cy="60" r="14" fill="#fff" />
                <path
                  d="M52 63c3 3 10 3 13 0"
                  stroke="#1976d2"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="55" cy="57" r="2.5" fill="#1976d2" />
                <circle cx="65" cy="57" r="2.5" fill="#1976d2" />
              </svg>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              paddingLeft: 0,
              color: "#181e5a",
              textAlign: "left",
            }}
          >
            <div
              style={{
                marginBottom: 12,
                fontSize: "clamp(20px, 4vw, 26px)",
                fontWeight: 800,
                color: "#181e5a",
              }}
            >
              {t("exam.congratulations")} 🏆
            </div>
            <div
              style={{
                lineHeight: 1.6,
                fontSize: "clamp(16px, 3vw, 18px)",
                fontWeight: 500,
                color: "#222",
              }}
            >
              {t("exam.congratulations")}
            </div>
          </div>
        </div>
        <button
          style={{
            background:
              "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
            color: "#1a1f5a",
            fontWeight: 800,
            fontSize: "clamp(18px, 4vw, 22px)",
            border: "none",
            borderRadius: 50,
            padding: "18px 50px",
            cursor: "pointer",
            boxShadow:
              "0 8px 25px rgba(255,215,0,0.3), 0 4px 10px rgba(0,0,0,0.1)",
            marginBottom: 20,
            transition: "all 0.2s ease",
            outline: "none",
            letterSpacing: "1px",
            textTransform: "uppercase",
            fontFamily: "inherit",
          }}
          onClick={handleViewScore}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
            e.currentTarget.style.boxShadow =
              "0 12px 35px rgba(255,215,0,0.4), 0 6px 15px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow =
              "0 8px 25px rgba(255,215,0,0.3), 0 4px 10px rgba(0,0,0,0.1)";
          }}
          onMouseDown={(e) =>
            (e.currentTarget.style.transform = "translateY(-1px) scale(0.98)")
          }
          onMouseUp={(e) =>
            (e.currentTarget.style.transform = "translateY(-3px) scale(1.02)")
          }
        >
          🎯 {t("exam.yourScore")}
        </button>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
