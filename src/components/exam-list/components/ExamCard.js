import React from "react";
import { Card, Typography, Box, Chip, Button } from "@mui/material";
import {
  People,
  QuestionAnswer,
  AccessTime,
  School,
  CheckCircle,
  RadioButtonUnchecked,
  Pending,
} from "@mui/icons-material";
import { useLanguage } from "../../../contexts/LanguageContext";

const ExamCard = ({
  assessment,
  onCardClick,
  showCompletionStatus = false,
}) => {
  const { t } = useLanguage();

  return (
    <Card
      onClick={() => onCardClick && onCardClick(assessment)}
      sx={{
        height: "100%",
        minHeight: { xs: "320px", sm: "340px" },
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.3s, box-shadow 0.3s",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          "& .image-container": {
            transform: "scale(1.05)",
          },
        },
      }}
    >
      {/* Background Image */}
      <Box
        className="image-container"
        sx={{
          height: "120px",
          backgroundImage: `url(${
            assessment.imgUrl ||
            "https://via.placeholder.com/400x120/1976d2/ffffff?text=SAT+Practice"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          p: 1.5,
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {/* Completion Status Badge */}
        {showCompletionStatus && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor:
                assessment.status === "isCompleted"
                  ? "rgba(76, 175, 80, 0.9)" // Green for completed
                  : assessment.status === "inProgress"
                  ? "rgba(255, 152, 0, 0.9)" // Orange for in progress
                  : "rgba(158, 158, 158, 0.9)", // Gray for not started
              borderRadius: "12px",
              px: 1,
              py: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              backdropFilter: "blur(4px)",
            }}
          >
            {assessment.status === "isCompleted" ? (
              <CheckCircle sx={{ fontSize: 14, color: "white" }} />
            ) : assessment.status === "inProgress" ? (
              <Pending sx={{ fontSize: 14, color: "white" }} />
            ) : (
              <RadioButtonUnchecked sx={{ fontSize: 14, color: "white" }} />
            )}
            <Typography
              variant="caption"
              sx={{
                color: "white",
                fontWeight: 600,
                fontSize: "0.7rem",
                lineHeight: 1,
              }}
            >
              {assessment.status === "isCompleted"
                ? t("examList.completed")
                : assessment.status === "inProgress"
                ? `${t("examList.inProgress")} (${
                    assessment.completedExamsCount
                  }/${assessment.totalExamsRequired})`
                : t("examList.notCompleted")}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 1.5, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#333",
            mb: 1.5,
            fontSize: { xs: "0.9rem", sm: "1rem" },
            lineHeight: 1.2,
          }}
        >
          {assessment.title?.text ||
            "LAB_01 SCIENTIFIC THINKING PROBLEM SOLVING"}
        </Typography>

        {/* Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            mb: 1.5,
          }}
        >
          {/* Tests */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 1,
              bgcolor: "#f8f9fa",
              borderRadius: 1.5,
              border: "1px solid #e9ecef",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <People sx={{ fontSize: 20, color: "#666", mb: 0.3 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#333",
                  fontSize: "16px",
                  mb: 0.1,
                }}
              >
                {assessment.numberOfTest || 0}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {t("examList.tests")}
            </Typography>
          </Box>

          {/* Questions */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 1,
              bgcolor: "#f8f9fa",
              borderRadius: 1.5,
              border: "1px solid #e9ecef",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <QuestionAnswer sx={{ fontSize: 20, color: "#666", mb: 0.3 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#333",
                  fontSize: "16px",
                  mb: 0.1,
                }}
              >
                {assessment.totalQuestion || 0}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {t("examList.questionsLabel")}
            </Typography>
          </Box>

          {/* Time */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 1,
              bgcolor: "#f8f9fa",
              borderRadius: 1.5,
              border: "1px solid #e9ecef",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <AccessTime sx={{ fontSize: 20, color: "#666", mb: 0.3 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#333",
                  fontSize: "16px",
                  mb: 0.1,
                }}
              >
                {assessment.totalTime || 0}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {t("examList.minutes")}
            </Typography>
          </Box>

          {/* Subject */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 1,
              bgcolor: "#f8f9fa",
              borderRadius: 1.5,
              border: "1px solid #e9ecef",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <School sx={{ fontSize: 20, color: "#666", mb: 0.3 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#333",
                  fontSize: "16px",
                  mb: 0.1,
                }}
              >
                {"SAT"}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {t("examList.exam")}
            </Typography>
          </Box>
        </Box>

        {/* Action Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#f44336",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.8rem",
            py: 1,
            borderRadius: 1.5,
            textTransform: "none",
            "&:hover": {
              bgcolor: "#d32f2f",
            },
          }}
        >
          {t("examList.takeTestNow")}
        </Button>
      </Box>
    </Card>
  );
};

export default ExamCard;
