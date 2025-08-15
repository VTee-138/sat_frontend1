import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Container,
  useMediaQuery,
  useTheme,
  Fade,
  Grow,
  Avatar,
} from "@mui/material";
import {
  QuestionAnswer,
  CheckCircle,
  Cancel,
  BugReport,
  Quiz,
  LightbulbOutlined,
  Assessment,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "react-toastify";
import { getUserPracticeStats } from "../../services/PracticeResultService";

export default function PracticeMain() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Statistics state - You can replace these with real API calls
  const [statistics, setStatistics] = useState({
    totalQuestions: 0,
    questionsCompleted: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
  });

  const [loading, setLoading] = useState(true);

  // Load real statistics from API
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        const response = await getUserPracticeStats();

        if (response && response.data) {
          const stats = response.data;
          setStatistics({
            totalQuestions: stats.totalQuestions || 0,
            questionsCompleted:
              stats.correctAnswers + stats.incorrectAnswers || 0,
            correctAnswers: stats.correctAnswers || 0,
            incorrectAnswers: stats.incorrectAnswers || 0,
          });
        }
      } catch (error) {
        console.error("Error loading practice statistics:", error);
        toast.error(t("errors.networkError"));
        // Fallback to default values if API fails
        setStatistics({
          totalQuestions: 0,
          questionsCompleted: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [t]);

  const practiceOptions = [
    {
      id: "error-analysis",
      title: t("practice.errorAnalysis"),
      description: t("practice.errorAnalysisDescription"),
      icon: <BugReport sx={{ fontSize: 48 }} />,
      color: "#f44336",
      path: "/practice/error",
      gradient: "linear-gradient(135deg, #f44336 0%, #e91e63 100%)",
    },
    {
      id: "question-bank",
      title: t("practice.questionBank"),
      description: t("practice.questionBankDescription"),
      icon: <Quiz sx={{ fontSize: 48 }} />,
      color: "#2196f3",
      path: "/practice/question-bank",
      gradient: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
    },
  ];

  const statisticsCards = [
    {
      title: t("practice.totalQuestions"),
      value: statistics.totalQuestions,
      icon: <QuestionAnswer />,
      color: "#2196f3",
      gradient: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
    },
    {
      title: t("practice.questionsCompleted"),
      value: statistics.questionsCompleted,
      icon: <Assessment />,
      color: "#ff9800",
      gradient: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
    },
    {
      title: t("practice.correctAnswers"),
      value: statistics.correctAnswers,
      icon: <CheckCircle />,
      color: "#4caf50",
      gradient: "linear-gradient(135deg, #4caf50 0%, #81c784 100%)",
    },
    {
      title: t("practice.incorrectAnswers"),
      value: statistics.incorrectAnswers,
      icon: <Cancel />,
      color: "#f44336",
      gradient: "linear-gradient(135deg, #f44336 0%, #e57373 100%)",
    },
  ];

  const handlePracticeOptionClick = (path) => {
    navigate(path);
  };

  const getAccuracyRate = () => {
    if (statistics.questionsCompleted === 0) return 0;
    return Math.round(
      (statistics.correctAnswers / statistics.questionsCompleted) * 100
    );
  };

  const getRecommendation = () => {
    const accuracyRate = getAccuracyRate();
    if (accuracyRate >= 80) {
      return t("practice.recommendations.excellent");
    } else if (accuracyRate >= 60) {
      return t("practice.recommendations.good");
    } else if (accuracyRate >= 40) {
      return t("practice.recommendations.needsImprovement");
    } else {
      return t("practice.recommendations.focusOnBasics");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: "64px",
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Header Section */}
          <Fade in={true} timeout={800}>
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
              >
                {t("practice.title")}
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6 }}
              >
                {t("practice.subtitle")}
              </Typography>
            </Box>
          </Fade>

          {/* Practice Options */}
          <Fade in={true} timeout={1000}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 600, mb: 3, textAlign: "center" }}
              >
                {t("practice.practiceOptions")}
              </Typography>
              <Grid container spacing={4}>
                {practiceOptions.map((option, index) => (
                  <Grid item xs={12} md={6} key={option.id}>
                    <Grow in={true} timeout={1200 + index * 200}>
                      <Card
                        sx={{
                          height: "100%",
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          borderRadius: 3,
                          overflow: "hidden",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          display: "flex",
                          flexDirection: "column",
                          "&:hover": {
                            transform: "translateY(-8px) scale(1.02)",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                          },
                        }}
                        onClick={() => handlePracticeOptionClick(option.path)}
                      >
                        <Box
                          sx={{
                            background: option.gradient,
                            height: "80px",
                            minHeight: "80px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          {option.icon}
                        </Box>
                        <CardContent
                          sx={{
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: 1,
                          }}
                        >
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="h5"
                              component="h3"
                              gutterBottom
                              sx={{ fontWeight: 600, color: option.color }}
                            >
                              {option.title}
                            </Typography>
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{ lineHeight: 1.6 }}
                            >
                              {option.description}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            sx={{
                              mt: 2,
                              background: option.gradient,
                              color: "white",
                              "&:hover": {
                                background: option.gradient,
                                opacity: 0.9,
                              },
                            }}
                            fullWidth
                          >
                            {t("practice.startPracticing")}
                          </Button>
                        </CardContent>
                      </Card>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>

          {/* Statistics Section */}
          <Fade in={true} timeout={1400}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 600, mb: 3, textAlign: "center" }}
              >
                {t("practice.statistics")}
              </Typography>
              <Grid container spacing={3}>
                {statisticsCards.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Grow in={true} timeout={1600 + index * 100}>
                      <Card
                        sx={{
                          height: "100%",
                          borderRadius: 3,
                          overflow: "hidden",
                          transition: "all 0.3s ease-in-out",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        }}
                      >
                        <Box
                          sx={{
                            background: "white",
                            p: 2,
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            color: stat.color,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h3"
                              component="div"
                              sx={{ fontWeight: 700, lineHeight: 1 }}
                            >
                              {loading ? "..." : stat.value.toLocaleString()}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ opacity: 0.9, mt: 0.5 }}
                            >
                              {stat.title}
                            </Typography>
                          </Box>
                          <Avatar
                            sx={{
                              bgcolor: "rgba(255,255,255,0.2)",
                              width: 48,
                              height: 48,
                            }}
                          >
                            {stat.icon}
                          </Avatar>
                        </Box>
                      </Card>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>

          {/* Recommendation Section */}
          <Fade in={true} timeout={1800}>
            <Card
              sx={{
                borderRadius: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    flexDirection: isMobile ? "column" : "row",
                    textAlign: isMobile ? "center" : "left",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      width: 56,
                      height: 56,
                      mr: isMobile ? 0 : 2,
                      mb: isMobile ? 2 : 0,
                    }}
                  >
                    <LightbulbOutlined sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {t("practice.recommendationTitle")}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ opacity: 0.9, lineHeight: 1.6 }}
                    >
                      {getRecommendation()}
                    </Typography>
                    {!loading && (
                      <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                        {t("practice.currentAccuracy")}: {getAccuracyRate()}%
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
}
