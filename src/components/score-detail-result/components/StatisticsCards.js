import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { CheckCircle, Cancel, TrendingUp, Quiz } from "@mui/icons-material";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function StatisticsCards({ data, tab }) {
  const { t } = useLanguage();

  // Lọc dữ liệu theo tab (giống logic trong index.js)
  const filteredData = React.useMemo(() => {
    if (tab === 0) return data;

    if (tab === 1) {
      const englishData = data.filter(
        (q) => q.section?.trim().toUpperCase() === "TIẾNG ANH"
      );
      return englishData;
    }

    if (tab === 2) {
      const mathData = data.filter(
        (q) => q.section?.trim().toUpperCase() === "TOÁN"
      );
      return mathData;
    }

    return data;
  }, [data, tab]);

  // Tính toán overview dựa trên dữ liệu đã lọc
  const totalQuestions = filteredData.length;
  const correctAnswers = filteredData.filter((q) => q.isCorrect).length;
  const accuracyRate =
    totalQuestions > 0
      ? ((correctAnswers / totalQuestions) * 100).toFixed(1)
      : 0;

  const statisticsConfig = [
    {
      icon: Quiz,
      value: totalQuestions,
      label: t("scoreDetails.totalQuestions") || "Total Questions",
      color: "#2196f3",
      // bgGradient: "rgba(255,255,255,0.98)",
      borderColor: "#e3f2fd",
      hoverColor: "#2196f3",
      shadowColor: "none",
      hoverShadowColor: "rgba(33,150,243,0.25)",
    },
    {
      icon: CheckCircle,
      value: correctAnswers,
      label: t("scoreDetails.correctAnswers") || "Correct Answers",
      color: "#4caf50",
      bgGradient: "rgba(255,255,255,0.98)",
      borderColor: "#e8f5e8",
      hoverColor: "#4caf50",
      // shadowColor: "rgba(76,175,80,0.15)",
      hoverShadowColor: "rgba(76,175,80,0.25)",
    },
    {
      icon: Cancel,
      value: totalQuestions - correctAnswers,
      label: t("scoreDetails.incorrectAnswers") || "Incorrect Answers",
      color: "#f44336",
      bgGradient: "rgba(255,255,255,0.98)",
      borderColor: "#ffebee",
      hoverColor: "#f44336",
      // shadowColor: "rgba(244,67,54,0.15)",
      hoverShadowColor: "rgba(244,67,54,0.25)",
    },
    {
      icon: TrendingUp,
      value: `${accuracyRate}%`,
      label: t("scoreDetails.accuracyRate") || "Accuracy Rate",
      color: "#ff9800",
      bgGradient: "rgba(255,255,255,0.98)",
      borderColor: "#fff3e0",
      hoverColor: "#ff9800",
      // shadowColor: "rgba(255,152,0,0.15)",
      hoverShadowColor: "rgba(255,152,0,0.25)",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          lg: "1fr 1fr 1fr 1fr",
        },
        gap: 3,
        mb: 6,
      }}
    >
      {statisticsConfig.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={index}
            elevation={4}
            sx={{
              background: stat.bgGradient,
              backdropFilter: "blur(20px)",
              border: `2px solid ${stat.borderColor}`,
              borderRadius: 4,
              boxShadow: "none",
              transition: "all 0.3s ease",
              // "&:hover": {
              //   transform: "translateY(-8px)",
              //   boxShadow: `0 20px 50px ${stat.hoverShadowColor}`,
              //   borderColor: stat.hoverColor,
              // },
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <IconComponent
                sx={{ fontSize: "3rem", color: stat.color, mb: 1 }}
              />
              <Typography
                variant="h3"
                sx={{ fontWeight: 900, color: stat.color, mb: 1 }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#666", fontWeight: 600 }}
              >
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
