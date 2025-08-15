import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Container,
  Avatar,
  LinearProgress,
  Chip,
  Paper,
  Fade,
  Zoom,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Assignment,
  TrendingUp,
  Home,
  Celebration,
} from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";
import Header from "../Header";

export default function PracticeSubmitResultPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;
  const message = location.state?.message;

  const getPerformanceLevel = (accuracy) => {
    if (accuracy >= 90)
      return { level: "excellent", color: "#4caf50", icon: <Celebration /> };
    if (accuracy >= 75)
      return { level: "good", color: "#2196f3", icon: <TrendingUp /> };
    if (accuracy >= 60)
      return { level: "average", color: "#ff9800", icon: <Assignment /> };
    return { level: "needsImprovement", color: "#f44336", icon: <Cancel /> };
  };

  if (!data) {
    return (
      <>
        <Header />
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "#f8f9fa",
            pt: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Container maxWidth="sm">
            <Fade in={true} timeout={800}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "error.main",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Cancel sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" color="error" gutterBottom>
                  {t("practice.result.noDataFound")}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {t("practice.result.noDataDescription")}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Home />}
                  onClick={() => navigate("/practice/question-bank")}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                  }}
                >
                  {t("practice.result.backToQuestionBank")}
                </Button>
              </Paper>
            </Fade>
          </Container>
        </Box>
      </>
    );
  }

  const performance = getPerformanceLevel(data.accuracy);

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          pt: "80px",
          pb: 4,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ py: 4 }}>
            {/* Header Section */}
            <Fade in={true} timeout={800}>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${performance.color} 30%, #667eea 90%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                    lineHeight: "65px",
                  }}
                >
                  {t("practice.result.submitSuccess")}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6 }}
                >
                  {t(`practice.result.performance.${performance.level}`)}
                </Typography>
              </Box>
            </Fade>

            {/* Results Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Accuracy Score */}
              <Grid item xs={12} md={6}>
                <Fade in={true} timeout={1200}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${performance.color}15 0%, ${performance.color}25 100%)`,
                      border: `2px solid ${performance.color}30`,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: "center" }}>
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 700,
                          color: performance.color,
                          mb: 1,
                        }}
                      >
                        {data.accuracy}%
                      </Typography>
                      <Typography
                        variant="h6"
                        color="text.primary"
                        gutterBottom
                      >
                        {t("practice.result.accuracy")}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={data.accuracy}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          mt: 2,
                          bgcolor: "rgba(0,0,0,0.1)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: performance.color,
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              {/* Summary Stats */}
              <Grid item xs={12} md={6}>
                <Fade in={true} timeout={1400}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {t("practice.result.summary")}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: "center", p: 2 }}>
                            <Avatar
                              sx={{
                                width: 50,
                                height: 50,
                                bgcolor: "#2196f3",
                                mx: "auto",
                                mb: 1,
                              }}
                            >
                              <Assignment />
                            </Avatar>
                            <Typography variant="h5" fontWeight={600}>
                              {data.totalQuestions}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {t("practice.result.totalQuestions")}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: "center", p: 2 }}>
                            <Avatar
                              sx={{
                                width: 50,
                                height: 50,
                                bgcolor: "#4caf50",
                                mx: "auto",
                                mb: 1,
                              }}
                            >
                              <CheckCircle />
                            </Avatar>
                            <Typography
                              variant="h5"
                              fontWeight={600}
                              color="success.main"
                            >
                              {data.correctAnswers}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {t("practice.result.correctAnswers")}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            </Grid>

            {/* Detailed Results */}
            <Fade in={true} timeout={1600}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  mb: 4,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 3 }}
                  >
                    {t("practice.result.detailedResults")}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: "center",
                          bgcolor: "#f8f9fa",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h4"
                          fontWeight={600}
                          color="primary"
                        >
                          {data.totalQuestions}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {t("practice.result.totalQuestions")}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: "center",
                          bgcolor: "#e8f5e8",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h4"
                          fontWeight={600}
                          color="success.main"
                        >
                          {data.correctAnswers}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {t("practice.result.correctAnswers")}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: "center",
                          bgcolor: "#ffebee",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h4"
                          fontWeight={600}
                          color="error.main"
                        >
                          {data.incorrectAnswers}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {t("practice.result.incorrectAnswers")}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Fade>

            {/* Performance Badge */}
            <Fade in={true} timeout={1800}>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Chip
                  icon={performance.icon}
                  label={t(`practice.result.badge.${performance.level}`)}
                  sx={{
                    bgcolor: performance.color,
                    color: "white",
                    fontSize: "1.1rem",
                    py: 3,
                    px: 2,
                    fontWeight: 600,
                    borderRadius: 3,
                  }}
                />
              </Box>
            </Fade>

            {/* Action Buttons */}
            <Fade in={true} timeout={2000}>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Home />}
                  onClick={() => navigate("/practice/question-bank")}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  {t("practice.result.backToQuestionBank")}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/practice")}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  {t("practice.result.continuePractice")}
                </Button>
              </Box>
            </Fade>
          </Box>
        </Container>
      </Box>
    </>
  );
}
