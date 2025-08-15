import React, { useEffect } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Psychology,
  Speed,
  EmojiEvents,
  School,
  ArrowForward,
} from "@mui/icons-material";
import { useLanguage } from "../../../contexts/LanguageContext";
import { toast } from "react-toastify";

const ExamTransition = ({
  assessmentId,
  currentSubject,
  currentModule,
  nextSubject,
  nextModule,
  onComplete,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    toast.success(
      `${t("exam.submittedSuccessfully")} - ${currentSubject} ${currentModule}`
    );

    // Start new exam after 3 seconds
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run only once

  const getDifficultyColor = (module) => {
    if (module?.includes("DIFFICULT")) return "error";
    if (module?.includes("EASY")) return "success";
    return "primary";
  };

  const getDifficultyText = (module) => {
    if (module?.includes("DIFFICULT")) return t("exam.difficult");
    if (module?.includes("EASY")) return t("exam.easy");
    return t("exam.standard");
  };

  const getSubjectIcon = (subject) => {
    return subject === "TOÁN" ? <School /> : <Psychology />;
  };

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
          background: "rgba(25, 118, 210, 0.1)",
          animation: "float 4s ease-in-out infinite 2s",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-15px)" },
          },
        }}
      />

      {/* Main content */}
      <Box
        sx={{
          textAlign: "center",
          zIndex: 1,
          maxWidth: "600px",
          width: "100%",
          px: 3,
          backgroundColor: "white",
          padding: "40px 20px",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Success Message */}
        <Box sx={{ mb: 4 }}>
          <EmojiEvents
            sx={{
              fontSize: 48,
              color: "#4caf50",
              mb: 2,
              animation: "bounce 2s ease-in-out infinite",
              "@keyframes bounce": {
                "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
                "40%": { transform: "translateY(-10px)" },
                "60%": { transform: "translateY(-5px)" },
              },
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#4caf50",
              mb: 1,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          >
            {t("exam.examCompleted")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            {currentSubject} {currentModule}
          </Typography>
        </Box>

        {/* Transition Arrow */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowForward
            sx={{
              fontSize: 32,
              color: "#1976d2",
              animation: "pulse 2s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)", opacity: 0.7 },
                "50%": { transform: "scale(1.2)", opacity: 1 },
              },
            }}
          />
        </Box>

        {/* Next Exam Info */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 3,
            bgcolor: "rgba(25, 118, 210, 0.05)",
            border: "2px solid rgba(25, 118, 210, 0.1)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#333",
              mb: 2,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            {t("exam.nextExam")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            {/* Subject */}
            <Chip
              icon={getSubjectIcon(nextSubject)}
              label={nextSubject}
              color="primary"
              variant="outlined"
              sx={{ fontSize: "0.9rem", fontWeight: 600 }}
            />

            {/* Difficulty */}
            <Chip
              label={getDifficultyText(nextModule)}
              color={getDifficultyColor(nextModule)}
              sx={{ fontSize: "0.9rem", fontWeight: 600 }}
            />
          </Box>
        </Box>

        {/* Countdown */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              mb: 2,
            }}
          >
            {t("exam.preparingNextExam")}
          </Typography>

          {/* Progress Bar */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "300px",
              mx: "auto",
              mb: 2,
            }}
          >
            <Box
              sx={{
                height: "8px",
                bgcolor: "#e0e0e0",
                borderRadius: "4px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  bgcolor: "#1976d2",
                  borderRadius: "4px",
                  animation: "progressBar 5s linear infinite",
                  "@keyframes progressBar": {
                    "0%": { width: "0%" },
                    "100%": { width: "100%" },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Motivational Message */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "rgba(76, 175, 80, 0.05)",
            border: "1px solid rgba(76, 175, 80, 0.1)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#4caf50",
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            {t("exam.keepGoing")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ExamTransition;
