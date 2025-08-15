import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { PlayArrow, Pause, PlayCircleOutline } from "@mui/icons-material";
import { useLanguage } from "../contexts/LanguageContext";

const CountdownBreakPage = () => {
  const { t } = useLanguage();
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get break info from location state
  const breakInfo = location.state || {};
  const { fromSubject = "TIẾNG ANH", toSubject = "TOÁN" } = breakInfo;

  // 10 minutes countdown (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);
  const [isActive, setIsActive] = useState(true);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Helper function to replace placeholders in translation strings
  const translateWithParams = (key, params = {}) => {
    let translation = t(key);
    Object.keys(params).forEach((param) => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    return translation;
  };

  // Helper function to translate subject names
  const getSubjectName = (subject) => {
    const subjectMap = {
      "TIẾNG ANH": t("common.english") || "English",
      TOÁN: t("common.math") || "Math",
    };
    return subjectMap[subject] || subject;
  };

  // Toggle pause/resume countdown
  const togglePause = () => {
    setIsActive(!isActive);
  };

  const handleContinue = useCallback(() => {
    // Set up new exam session for Math
    const startTime = Date.now();
    localStorage.setItem("exam_start_time", startTime.toString());
    localStorage.setItem("exam_assessment_id", assessmentId);
    localStorage.setItem("exam_currentSubject", toSubject);
    localStorage.setItem("exam_currentModule", "MODULE 1"); // Always start with MODULE 1 for Math

    // Continue to math exam
    navigate(`/exam/${assessmentId}`, {
      state: {
        continueToMath: true,
        fromBreak: true,
      },
    });
  }, [assessmentId, toSubject, navigate]);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            // Time's up - automatically continue to math
            handleContinue();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleContinue]);

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
            radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.1) 0%, transparent 50%)
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
          background: "rgba(76, 175, 80, 0.1)",
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
          background: "rgba(33, 150, 243, 0.1)",
          animation: "float 4s ease-in-out infinite 2s",
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
          background: "rgba(255, 152, 0, 0.1)",
          animation: "float 8s ease-in-out infinite 1s",
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
          background: "rgba(156, 39, 176, 0.1)",
          animation: "float 5s ease-in-out infinite 3s",
        }}
      />

      {/* Main content */}
      <Box
        sx={{
          textAlign: "center",
          zIndex: 1,
          maxWidth: "600px",
          px: 3,
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Success Message */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#4caf50",
            mb: 2,
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
          }}
        >
          🎉 {t("countdownBreak.congratulations")}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: "#333",
            mb: 2,
            fontSize: { xs: "1.1rem", sm: "1.3rem" },
          }}
        >
          {translateWithParams("countdownBreak.completedSubject", {
            subject: getSubjectName(fromSubject),
          })}
        </Typography>

        {/* Countdown Timer */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#1976d2",
              mb: 1,
              fontSize: { xs: "1.3rem", sm: "1.5rem" },
            }}
          >
            {translateWithParams("countdownBreak.breakTime", {
              time: formatTime(timeLeft),
            })}
          </Typography>

          {/* Pause status */}
          {!isActive && (
            <Typography
              variant="body2"
              sx={{
                color: "#ff9800",
                fontWeight: 600,
                mb: 2,
                fontSize: "0.9rem",
              }}
            >
              {t("countdownBreak.paused")}
            </Typography>
          )}

          {/* Circular progress indicator */}
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              mb: 2,
            }}
          >
            <svg
              width="200"
              height="200"
              style={{ transform: "rotate(-90deg)" }}
            >
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#1976d2"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - timeLeft / 600)}`}
                style={{
                  transition: "stroke-dashoffset 1s ease-in-out",
                }}
              />
            </svg>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: "#1976d2",
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                }}
              >
                {Math.ceil(timeLeft / 60)}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {t("countdownBreak.minutes")}
              </Typography>
            </Box>
          </Box>

          {/* Pause/Resume Button */}
          <Button
            variant="outlined"
            size="medium"
            startIcon={isActive ? <Pause /> : <PlayCircleOutline />}
            onClick={togglePause}
            sx={{
              mt: 3,
              px: 3,
              py: 1,
              fontSize: "0.95rem",
              fontWeight: 600,
              borderRadius: 3,
              borderColor: isActive ? "#ff9800" : "#4caf50",
              color: isActive ? "#ff9800" : "#4caf50",
              "&:hover": {
                borderColor: isActive ? "#f57c00" : "#45a049",
                color: isActive ? "#f57c00" : "#45a049",
                backgroundColor: isActive
                  ? "rgba(255, 152, 0, 0.04)"
                  : "rgba(76, 175, 80, 0.04)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {isActive
              ? t("countdownBreak.pauseButton")
              : t("countdownBreak.resumeButton")}
          </Button>
        </Box>

        {/* Next subject info */}
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "rgba(33, 150, 243, 0.05)",
            border: "2px solid rgba(33, 150, 243, 0.1)",
            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#1976d2",
              fontWeight: 600,
              mb: 1,
            }}
          >
            {translateWithParams("countdownBreak.nextSubject", {
              subject: getSubjectName(toSubject),
            })}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontSize: "0.95rem",
            }}
          >
            {t("countdownBreak.restMessage")}
          </Typography>
        </Box>

        {/* Continue Button */}
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrow />}
          onClick={handleContinue}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 600,
            borderRadius: 3,
            bgcolor: "#4caf50",
            "&:hover": {
              bgcolor: "#45a049",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {translateWithParams("countdownBreak.continueButton", {
            subject: getSubjectName(toSubject),
          })}
        </Button>

        {/* Tips */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#999",
              fontSize: "0.85rem",
              lineHeight: 1.6,
            }}
          >
            {t("countdownBreak.tips")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CountdownBreakPage;
