import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  QuestionAnswer,
  Schedule,
  CheckCircle,
  TrendingUp,
  Pending,
} from "@mui/icons-material";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function CompletedExamCard({ assessment, onCardClick }) {
  const { t } = useLanguage();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get progress color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "#4caf50"; // Green
    if (percentage >= 60) return "#ff9800"; // Orange
    if (percentage >= 40) return "#f44336"; // Red
    return "#9e9e9e"; // Gray
  };

  // Get performance level text
  const getPerformanceLevel = (percentage) => {
    if (percentage >= 80) return t("examList.excellent");
    if (percentage >= 60) return t("examList.good");
    if (percentage >= 40) return t("examList.average");
    return t("examList.needsImprovement");
  };

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor:
          assessment.numberOfExamsCompleted == assessment.numberOfTotalExams
            ? "pointer"
            : "not-allowed",
        transition: "all 0.3s ease-in-out",
        border: "1px solid #e0e0e0",
        ...(assessment.numberOfExamsCompleted ===
          assessment.numberOfTotalExams && {
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            borderColor: "#2563eb",
          },
        }),
      }}
      onClick={() => {
        if (
          assessment.numberOfExamsCompleted == assessment.numberOfTotalExams
        ) {
          onCardClick(assessment);
        }
      }}
    >
      {/* Header with Image */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="120"
          image={assessment.imgUrl || "/default-exam-image.jpg"}
          alt={assessment.title?.text || "Exam"}
          sx={{
            objectFit: "cover",
            height: "200px",
          }}
        />

        {/* Completion Badge */}
        {assessment.numberOfExamsCompleted == assessment.numberOfTotalExams ? (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(76, 175, 80, 0.9)",
              borderRadius: "12px",
              px: 1,
              py: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <CheckCircle sx={{ fontSize: 16, color: "white" }} />
            <Typography
              variant="caption"
              sx={{
                color: "white",
                fontWeight: 600,
                fontSize: "0.7rem",
              }}
            >
              {t("examList.completed")}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255, 152, 0, 0.9)",
              borderRadius: "12px",
              px: 1,
              py: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Pending sx={{ fontSize: 14, color: "white" }} />
            <Typography
              variant="caption"
              sx={{
                color: "white",
                fontWeight: 600,
                fontSize: "0.7rem",
              }}
            >
              {t("examList.inProgress")} ({assessment.numberOfExamsCompleted}/
              {assessment.numberOfTotalExams})
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
          "&:last-child": { pb: 2 },
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            color: "#333",
            mb: 1,
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {assessment.title?.text || "Exam Title"}
        </Typography>

        {/* Score Section */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
              {t("examList.yourScore")}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: getProgressColor(assessment.percentage || 0),
              }}
            >
              {assessment.totalScore || 0}/{assessment.maxPossibleScore || 1600}
            </Typography>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={assessment.percentage || 0}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#f5f5f5",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: getProgressColor(assessment.percentage || 0),
                  borderRadius: 4,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: getProgressColor(assessment.percentage || 0),
                fontWeight: 600,
              }}
            >
              {assessment.percentage || 0}%
            </Typography>
            <Chip
              label={getPerformanceLevel(assessment.percentage || 0)}
              size="small"
              sx={{
                backgroundColor: `${getProgressColor(
                  assessment.percentage || 0
                )}15`,
                color: getProgressColor(assessment.percentage || 0),
                fontWeight: 500,
                fontSize: "0.7rem",
                height: 20,
              }}
            />
          </Box>
        </Box>

        {/* Stats Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          {/* Tests Completed */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <QuestionAnswer sx={{ fontSize: 16, color: "#666" }} />
            <Typography variant="caption" sx={{ color: "#666" }}>
              {assessment.numberOfExamsCompleted || 0}/{" "}
              {assessment.numberOfTotalExams} {t("examList.tests")}
            </Typography>
          </Box>

          {/* Total Time */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Schedule sx={{ fontSize: 16, color: "#666" }} />
            <Typography variant="caption" sx={{ color: "#666" }}>
              {assessment.totalTime || 0} {t("examList.minutes")}
            </Typography>
          </Box>
        </Box>

        {/* Completion Date */}
        {assessment.completedDate && (
          <Box
            sx={{
              mt: "auto",
              pt: 1,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#999",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <CheckCircle sx={{ fontSize: 14 }} />
              {t("examList.completedOn")} {formatDate(assessment.completedDate)}
            </Typography>
          </Box>
        )}

        {/* View Details Button Area */}
        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 1,
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color:
                assessment.numberOfExamsCompleted ==
                assessment.numberOfTotalExams
                  ? "#2563eb"
                  : "#999",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <TrendingUp sx={{ fontSize: 16 }} />
            {t("examList.viewDetails")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
