import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Fade,
  CircularProgress,
  Alert,
  Paper,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLanguage } from "../../contexts/LanguageContext";
import { getAllQuestionsByCategory } from "../../services/QuestionBankService";
import { toast } from "react-toastify";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import CustomTestModal from "./CustomTestModal";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: 12,
  transition: "all 0.3s ease",
  border: "1px solid rgba(0,0,0,0.08)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
}));

const CategoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  background: "#ffffff",
  border: "1px solid #e3f2fd",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    boxShadow: "0 4px 16px rgba(25, 118, 210, 0.15)",
    borderColor: "#2196f3",
  },
}));

const SubjectContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: 16,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  border: "1px solid #e3f2fd",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
}));

const SubjectHeader = styled(Box)(({ theme, subjectcolor }) => ({
  background: subjectcolor,
  color: "white",
  padding: theme.spacing(2, 3),
  borderRadius: 12,
  marginBottom: theme.spacing(3),
  textAlign: "center",
}));

export default function QuestionBankMain() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customTestModalOpen, setCustomTestModalOpen] = useState(false);

  useEffect(() => {
    const loadQuestionBank = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllQuestionsByCategory();

        if (response && response.data) {
          setData(response.data);
        }
      } catch (err) {
        console.error("Error loading question bank:", err);
        setError(t("errors.networkError"));
        toast.error(t("errors.networkError"));
      } finally {
        setLoading(false);
      }
    };

    loadQuestionBank();
  }, []);

  const getColorBySubject = (subject) => {
    return subject === "MATH"
      ? "#1976d2" // Blue
      : "#388e3c"; // Green
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "#4caf50";
      case "MEDIUM":
        return "#ff9800";
      case "HARD":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  const getTypeColor = (type) => {
    return type === "TN" ? "#2196f3" : "#9c27b0";
  };

  const handlePracticeAll = (subject, parentCategory) => {
    const params = new URLSearchParams({
      subject: subject,
      parentCategory: parentCategory,
    });
    navigate(`/countdown-bank?${params.toString()}`);
  };

  const handlePracticeSpecific = (subject, childCategory) => {
    localStorage.removeItem("customExamData");
    const params = new URLSearchParams({
      subject: subject,
      questionType: childCategory,
    });
    navigate(`/countdown-bank?${params.toString()}`);
  };

  if (loading) {
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
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
          </Box>
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Box
          sx={{
            minHeight: "100vh",
            pt: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Container maxWidth="md">
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          </Container>
        </Box>
      </>
    );
  }

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
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            {/* Page Header */}
            <Fade in={true} timeout={800}>
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background:
                      "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 2,
                  }}
                >
                  {t("questionBank.title")}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6 }}
                >
                  {t("questionBank.subtitle")}
                </Typography>
              </Box>
            </Fade>

            {/* Summary Stats */}
            {data?.summary && (
              <Fade in={true} timeout={1000}>
                <Grid container spacing={3} sx={{ mb: 6 }}>
                  <Grid item xs={6} md={3}>
                    <StyledCard>
                      <CardContent sx={{ textAlign: "center", p: 3 }}>
                        <Typography
                          variant="h4"
                          color="primary"
                          fontWeight={700}
                        >
                          {data.summary.totalQuestions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t("questionBank.totalQuestions")}
                        </Typography>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <StyledCard>
                      <CardContent sx={{ textAlign: "center", p: 3 }}>
                        <Typography
                          variant="h4"
                          color="secondary"
                          fontWeight={700}
                        >
                          {data.summary.totalCategories}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t("questionBank.categories")}
                        </Typography>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <StyledCard>
                      <CardContent sx={{ textAlign: "center", p: 3 }}>
                        <Typography
                          variant="h4"
                          sx={{ color: "#43e97b" }}
                          fontWeight={700}
                        >
                          {data.summary.totalChildCategories}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t("questionBank.subcategories")}
                        </Typography>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <StyledCard>
                      <CardContent sx={{ textAlign: "center", p: 3 }}>
                        <Typography
                          variant="h4"
                          sx={{ color: "#fd79a8" }}
                          fontWeight={700}
                        >
                          {data.summary.subjects?.length || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t("questionBank.subjects")}
                        </Typography>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                </Grid>
              </Fade>
            )}

            {/* Create Custom Test Button */}
            <Fade in={true} timeout={1200}>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setCustomTestModalOpen(true)}
                  sx={{
                    borderRadius: 3,
                    px: 6,
                    py: 2,
                    fontSize: "18px",
                    fontWeight: 700,
                    background:
                      "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
                      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.6)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {t("questionBank.createCustomTest")}
                </Button>
              </Box>
            </Fade>

            {/* Subjects */}
            {data?.subjects &&
              Object.entries(data.subjects).map(
                ([subjectKey, subject], subjectIndex) => (
                  <Fade
                    key={subjectKey}
                    in={true}
                    timeout={1200 + subjectIndex * 200}
                  >
                    <SubjectContainer>
                      {/* Subject Header */}
                      <SubjectHeader
                        subjectcolor={getColorBySubject(subjectKey)}
                      >
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item>
                            <Avatar
                              sx={{
                                width: 50,
                                height: 50,
                                bgcolor: "rgba(255,255,255,0.2)",
                                fontSize: "18px",
                                fontWeight: 600,
                              }}
                            >
                              {subject.totalQuestions}
                            </Avatar>
                          </Grid>
                          <Grid item xs>
                            <Typography
                              variant="h4"
                              fontWeight={700}
                              sx={{ mb: 0.5 }}
                            >
                              {t(`questionBank.${subjectKey}`)}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                              {subject.totalQuestions}{" "}
                              {t("questionBank.questions")} •{" "}
                              {subject.totalCategories}{" "}
                              {t("questionBank.categories")} •{" "}
                              {subject.totalChildCategories}{" "}
                              {t("questionBank.subcategories")}
                            </Typography>
                          </Grid>
                        </Grid>
                      </SubjectHeader>

                      {/* Categories with two-column layout */}
                      <Grid container spacing={3}>
                        {subject.categories?.map((category, categoryIndex) => (
                          <Grid item xs={12} key={category.parentCategory}>
                            <CategoryCard
                              onClick={() =>
                                setSelectedCategory(
                                  selectedCategory?.parentCategory ===
                                    category.parentCategory
                                    ? null
                                    : category
                                )
                              }
                              sx={{
                                backgroundColor:
                                  selectedCategory?.parentCategory ===
                                  category.parentCategory
                                    ? "#e3f2fd"
                                    : "#ffffff",
                              }}
                            >
                              <Grid container spacing={3}>
                                {/* Category Info - Right Side */}
                                <Grid item xs={12} md={4}>
                                  <Box sx={{ textAlign: "center", py: 2 }}>
                                    <Typography
                                      variant="h5"
                                      fontWeight={600}
                                      sx={{
                                        mb: 1,
                                        textTransform: "capitalize",
                                        color: getColorBySubject(subjectKey),
                                      }}
                                    >
                                      {category.parentCategory}
                                    </Typography>
                                    <Chip
                                      label={`${category.totalQuestions} ${t(
                                        "questionBank.questions"
                                      )}`}
                                      sx={{
                                        backgroundColor:
                                          getColorBySubject(subjectKey),
                                        color: "white",
                                        fontWeight: 600,
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mt: 1 }}
                                    >
                                      {category.childCategories?.length || 0}{" "}
                                      {t("questionBank.subcategories")}
                                    </Typography>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      sx={{
                                        mt: 2,
                                        backgroundColor:
                                          getColorBySubject(subjectKey),
                                        color: "white",
                                        fontWeight: 600,
                                        "&:hover": {
                                          backgroundColor:
                                            getColorBySubject(subjectKey),
                                          opacity: 0.9,
                                        },
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePracticeAll(
                                          subjectKey,
                                          category.parentCategory
                                        );
                                      }}
                                    >
                                      {t("questionBank.practiceAll")}
                                    </Button>
                                  </Box>
                                </Grid>

                                {/* Child Categories - Left Side with Horizontal Scroll */}
                                <Grid item xs={12} md={8}>
                                  <Box
                                    sx={{
                                      overflowX: "auto",
                                      overflowY: "hidden",
                                      pb: 1,
                                      "&::-webkit-scrollbar": {
                                        height: "8px",
                                      },
                                      "&::-webkit-scrollbar-track": {
                                        background: "#f1f1f1",
                                        borderRadius: "4px",
                                      },
                                      "&::-webkit-scrollbar-thumb": {
                                        background: "#c1c1c1",
                                        borderRadius: "4px",
                                        "&:hover": {
                                          background: "#a8a8a8",
                                        },
                                      },
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 2,
                                        minWidth: "fit-content",
                                        py: 1,
                                      }}
                                    >
                                      {category.childCategories?.map(
                                        (child, childIndex) => (
                                          <Paper
                                            key={child.childCategory}
                                            sx={{
                                              minWidth: "280px",
                                              maxWidth: "320px",
                                              p: 2,
                                              borderRadius: 2,
                                              border: "1px solid #e9ecef",
                                              transition: "all 0.2s ease",
                                              cursor: "pointer",
                                              "&:hover": {
                                                borderColor:
                                                  getColorBySubject(subjectKey),
                                                transform: "translateY(-2px)",
                                                boxShadow:
                                                  "0 4px 12px rgba(0,0,0,0.1)",
                                              },
                                            }}
                                            onClick={() =>
                                              handlePracticeSpecific(
                                                subjectKey,
                                                child.childCategory
                                              )
                                            }
                                          >
                                            {/* Header */}
                                            <Box
                                              sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                mb: 1.5,
                                              }}
                                            >
                                              <Typography
                                                variant="subtitle1"
                                                sx={{
                                                  fontWeight: 600,
                                                  textTransform: "capitalize",
                                                  color: "#1a1a1a",
                                                  flex: 1,
                                                  lineHeight: 1.3,
                                                  mr: 1,
                                                }}
                                              >
                                                {child.childCategory}
                                              </Typography>
                                              <Chip
                                                label={child.totalQuestions}
                                                size="small"
                                                sx={{
                                                  backgroundColor:
                                                    getColorBySubject(
                                                      subjectKey
                                                    ),
                                                  color: "white",
                                                  fontWeight: 600,
                                                  minWidth: "45px",
                                                }}
                                              />
                                            </Box>

                                            {/* Statistics */}
                                            {child.statistics && (
                                              <Box>
                                                {/* Difficulty Stats */}
                                                <Box sx={{ mb: 1.5 }}>
                                                  <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                      fontWeight: 600,
                                                      display: "block",
                                                      mb: 0.5,
                                                    }}
                                                  >
                                                    {t(
                                                      "questionBank.difficulty"
                                                    )}
                                                    :
                                                  </Typography>
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      gap: 0.5,
                                                      flexWrap: "wrap",
                                                    }}
                                                  >
                                                    {Object.entries(
                                                      child.statistics
                                                        .byDifficulty || {}
                                                    ).map(
                                                      ([diff, count]) =>
                                                        count > 0 && (
                                                          <Chip
                                                            key={diff}
                                                            label={`${t(
                                                              `questionBank.${diff}`
                                                            )}: ${count}`}
                                                            size="small"
                                                            sx={{
                                                              backgroundColor:
                                                                getDifficultyColor(
                                                                  diff
                                                                ),
                                                              color: "white",
                                                              fontSize: "11px",
                                                              height: "22px",
                                                              fontWeight: 500,
                                                            }}
                                                          />
                                                        )
                                                    )}
                                                  </Box>
                                                </Box>

                                                {/* Type Stats */}
                                                <Box>
                                                  <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                      fontWeight: 600,
                                                      display: "block",
                                                      mb: 0.5,
                                                    }}
                                                  >
                                                    {t("questionBank.type")}:
                                                  </Typography>
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      gap: 0.5,
                                                      flexWrap: "wrap",
                                                    }}
                                                  >
                                                    {Object.entries(
                                                      child.statistics.byType ||
                                                        {}
                                                    ).map(
                                                      ([type, count]) =>
                                                        count > 0 && (
                                                          <Chip
                                                            key={type}
                                                            label={`${t(
                                                              `questionBank.${type}`
                                                            )}: ${count}`}
                                                            size="small"
                                                            sx={{
                                                              backgroundColor:
                                                                getTypeColor(
                                                                  type
                                                                ),
                                                              color: "white",
                                                              fontSize: "11px",
                                                              height: "22px",
                                                              fontWeight: 500,
                                                            }}
                                                          />
                                                        )
                                                    )}
                                                  </Box>
                                                </Box>
                                              </Box>
                                            )}
                                          </Paper>
                                        )
                                      )}
                                    </Box>
                                  </Box>
                                </Grid>
                              </Grid>
                            </CategoryCard>
                          </Grid>
                        ))}
                      </Grid>
                    </SubjectContainer>
                  </Fade>
                )
              )}
          </Box>
        </Container>
      </Box>

      {/* Custom Test Modal */}
      <CustomTestModal
        open={customTestModalOpen}
        onClose={() => setCustomTestModalOpen(false)}
        data={data}
      />
    </>
  );
}
