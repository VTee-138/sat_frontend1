import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Psychology, Speed, EmojiEvents, School } from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";
import { clearExamLocalStorage } from "../../common/clearExamLocal";

const CountdownPageBank = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have custom exam data
    const customExamData = localStorage.getItem("customExamData");

    if (customExamData) {
      // We have custom exam data, proceed with custom exam flow
      // Clear any existing exam data from localStorage
      clearExamLocalStorage();

      const timer = setTimeout(() => {
        // Navigate to practice exam page for custom test
        navigate("/exam-bank");
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      // Regular exam flow
      // Clear any existing exam data from localStorage
      clearExamLocalStorage();

      const timer = setTimeout(() => {
        // Navigate to exam page after 5 seconds
        navigate(`/exam-bank/?${searchParams.toString()}`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [navigate, searchParams]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 200, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(120, 200, 255, 0.1) 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />

      {/* Floating decorative circles */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(25, 118, 210, 0.05)",
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          right: "15%",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "rgba(76, 175, 80, 0.05)",
          animation: "float 4s ease-in-out infinite 2s",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-15px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "20%",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255, 107, 53, 0.05)",
          animation: "float 8s ease-in-out infinite 1s",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-25px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "30%",
          right: "10%",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "rgba(156, 39, 176, 0.05)",
          animation: "float 5s ease-in-out infinite 3s",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-18px)" },
          },
        }}
      />

      {/* Main content */}
      <Box
        sx={{
          textAlign: "center",
          zIndex: 1,
          maxWidth: "500px",
          px: 3,
          backgroundColor: "white",
          padding: "20px 10px",
          borderRadius: "10px",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: "#333",
            mb: 8,
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          {t("countdown.title")}
        </Typography>

        {/* Hourglass Icon */}
        <Box
          sx={{
            mb: 8,
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Decorative Icons */}
          <Psychology
            sx={{
              position: "absolute",
              top: "10%",
              left: "15%",
              fontSize: 32,
              color: "#1976d2",
              opacity: 0.3,
              animation: "pulse 3s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)", opacity: 0.3 },
                "50%": { transform: "scale(1.1)", opacity: 0.5 },
              },
            }}
          />
          <Speed
            sx={{
              position: "absolute",
              top: "10%",
              right: "15%",
              fontSize: 28,
              color: "#4caf50",
              opacity: 0.3,
              animation: "pulse 3s ease-in-out infinite 1s",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)", opacity: 0.3 },
                "50%": { transform: "scale(1.1)", opacity: 0.5 },
              },
            }}
          />
          <EmojiEvents
            sx={{
              position: "absolute",
              bottom: "10%",
              left: "15%",
              fontSize: 30,
              color: "#ff9800",
              opacity: 0.3,
              animation: "pulse 3s ease-in-out infinite 2s",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)", opacity: 0.3 },
                "50%": { transform: "scale(1.1)", opacity: 0.5 },
              },
            }}
          />
          <School
            sx={{
              position: "absolute",
              bottom: "10%",
              right: "15%",
              fontSize: 26,
              color: "#9c27b0",
              opacity: 0.3,
              animation: "pulse 3s ease-in-out infinite 0.5s",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)", opacity: 0.3 },
                "50%": { transform: "scale(1.1)", opacity: 0.5 },
              },
            }}
          />

          <Box
            sx={{
              width: 140,
              height: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Hourglass SVG */}
            <svg
              width="120"
              height="120"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Hourglass frame */}
              <rect x="20" y="10" width="60" height="10" fill="#666" rx="2" />
              <rect x="20" y="80" width="60" height="10" fill="#666" rx="2" />
              <path
                d="M25 20 L75 20 L60 50 L75 80 L25 80 L40 50 Z"
                fill="none"
                stroke="#666"
                strokeWidth="2"
              />

              {/* Sand */}
              <rect
                x="30"
                y="25"
                width="40"
                height="15"
                fill="#ff6b35"
                rx="2"
              />
              <rect
                x="45"
                y="55"
                width="10"
                height="20"
                fill="#87ceeb"
                rx="1"
              />

              {/* Falling sand dots */}
              <circle cx="50" cy="45" r="1" fill="#ff6b35">
                <animate
                  attributeName="cy"
                  values="45;55;45"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="48" cy="48" r="1" fill="#ff6b35">
                <animate
                  attributeName="cy"
                  values="48;58;48"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="52" cy="46" r="1" fill="#ff6b35">
                <animate
                  attributeName="cy"
                  values="46;56;46"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box
          sx={{ mt: 4, mb: 2, width: "100%", maxWidth: "300px", mx: "auto" }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#999",
              fontSize: "0.75rem",
              textAlign: "center",
              display: "block",
              mb: 1,
            }}
          >
            {t("countdown.preparing")}
          </Typography>
          <Box
            sx={{
              height: "6px",
              bgcolor: "#e0e0e0",
              borderRadius: "3px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                height: "100%",
                bgcolor: "#1976d2",
                borderRadius: "3px",
                animation: "progressBar 5s linear infinite",
                "@keyframes progressBar": {
                  "0%": { width: "0%" },
                  "100%": { width: "100%" },
                },
              }}
            />
          </Box>
        </Box>

        {/* Message */}
        <Typography
          variant="body1"
          sx={{
            color: "#666",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            lineHeight: 1.6,
            mb: 3,
          }}
        >
          {t("countdown.message")}
        </Typography>

        {/* Motivational Quote */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "rgba(25, 118, 210, 0.05)",
            border: "1px solid rgba(25, 118, 210, 0.1)",
            maxWidth: "400px",
            mx: "auto",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#1976d2",
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            {t("countdown.quote")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CountdownPageBank;
