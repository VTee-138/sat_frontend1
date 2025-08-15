import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper, Container } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import { useLanguage } from "../contexts/LanguageContext";
import Header from "../components/Header";
import { getCachedScore } from "../services/TestService";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

export default function ScoreDetailsPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalScoreSum, setTotalScoreSum] = useState(null);
  const [scoreDiff, setScoreDiff] = useState(null);

  const fetchScoreData = async (assessmentId) => {
    try {
      const res = await getCachedScore(assessmentId);
      setScoreData(res.data);
      // Tính toán tổng điểm và chênh lệch
      if (res.data && res.data.totalScore && res.data.cacheTotalScore) {
        const total = Math.round(
          Object.values(res.data.totalScore).reduce((a, b) => a + b, 0)
        );
        const cache = Math.round(
          Object.values(res.data.cacheTotalScore).reduce((a, b) => a + b, 0)
        );
        setTotalScoreSum(total);
        setScoreDiff(total - cache);
      } else {
        setTotalScoreSum(null);
        setScoreDiff(null);
      }
      setLoading(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error fetching score");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchScoreData(id);
    }
  }, [id]);

  const handleSeeScoreDetails = () => {
    navigate(`/score-details/${id}/result`);
  };

  const diffText = useMemo(() => {
    if (scoreDiff === null) return null;
    if (scoreDiff >= 0) {
      return `✅ ${t("scoreDetails.achievementMessage")} ${scoreDiff} ${t(
        "scoreDetails.achievementMessage1"
      )}`;
    } else {
      return `❌ ${t("scoreDetails.achievementMessageNegative")} ${Math.abs(
        scoreDiff
      )} ${t("scoreDetails.achievementMessageNegative1")}`;
    }
  }, [scoreDiff, t]);

  const diffBoxColor = useMemo(() => {
    if (scoreDiff === null) return { bgcolor: "#e8f5e8", color: "#2e7d32" };
    if (scoreDiff >= 0) {
      return { bgcolor: "#e8f5e8", color: "#2e7d32" };
    } else {
      return { bgcolor: "#ffebee", color: "#d32f2f" };
    }
  }, [scoreDiff]);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
        {loading ? (
          <Loading />
        ) : scoreData ? (
          <>
            {/* Page Title */}
            <Typography
              variant="h4"
              sx={{
                color: "#2c3e50",
                fontWeight: 700,
                mb: 4,
                fontSize: { xs: "1.75rem", md: "2.125rem" },
              }}
            >
              {t("scoreDetails.title")}
            </Typography>
            {/* Score Report Card */}
            <Paper
              elevation={3}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                mb: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              }}
            >
              {/* Header Section */}
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #4a90e2 0%, #357abd 100%)",
                  color: "white",
                  p: 4,
                  position: "relative",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: "1.5rem", md: "1.75rem" },
                  }}
                >
                  {t("scoreDetails.latestTest")}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {scoreData.lastUpdated
                    ? `${t("scoreDetails.testDate")} ${new Date(
                        scoreData.lastUpdated
                      ).toLocaleString()}`
                    : ""}
                </Typography>
                <Box
                  sx={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    opacity: 0.1,
                    fontSize: "4rem",
                  }}
                >
                  🎓
                </Box>
              </Box>
              {/* Score Content */}
              <Box sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                    alignItems: { xs: "stretch", md: "flex-start" },
                  }}
                >
                  {/* Total Score Section */}
                  <Box
                    sx={{
                      flex: "0 0 auto",
                      textAlign: { xs: "center", md: "left" },
                      width: { xs: "100%", md: "40%" },
                    }}
                  >
                    <Typography
                      variant="overline"
                      sx={{
                        color: "#666",
                        fontWeight: 600,
                        letterSpacing: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      {t("scoreDetails.totalScore")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 1,
                        justifyContent: { xs: "center", md: "flex-start" },
                      }}
                    >
                      <Typography
                        variant="h1"
                        sx={{
                          fontSize: { xs: "3.5rem", md: "4rem" },
                          fontWeight: 900,
                          color: "#2c3e50",
                          lineHeight: 0.9,
                        }}
                      >
                        {/* Tổng điểm là tổng các môn, làm tròn số nguyên */}
                        {totalScoreSum !== null ? totalScoreSum : "-"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          fontWeight: 500,
                          mb: 1,
                        }}
                      >
                        {scoreData.scoreRange || t("scoreDetails.scoreRange")}
                      </Typography>
                    </Box>
                    {diffText && (
                      <Box
                        sx={{
                          mt: 3,
                          p: 2,
                          bgcolor: diffBoxColor.bgcolor,
                          borderRadius: 2,
                          border:
                            scoreDiff >= 0
                              ? "1px solid #c8e6c9"
                              : "1px solid #ffcdd2",
                          width: "fit-content",
                          mx: { xs: "auto", md: "0" },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: diffBoxColor.color,
                            fontWeight: 500,
                            lineHeight: 1.4,
                          }}
                        >
                          {diffText}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {/* Subject Scores */}
                  <Box sx={{ flex: 1, width: { xs: "100%", md: "60%" } }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 3,
                        mb: 4,
                      }}
                    >
                      {/* Reading & Writing Score */}
                      <Box
                        sx={{
                          flex: 1,
                          textAlign: "center",
                          p: 3,
                          bgcolor: "#f8f9ff",
                          borderRadius: 2,
                          border: "2px solid #e3f2fd",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            fontWeight: 600,
                            mb: 1,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {t("scoreDetails.readingWriting")}
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{
                            fontSize: "2.5rem",
                            fontWeight: 800,
                            color: "#1976d2",
                          }}
                        >
                          {/* TIẾNG ANH */}
                          {scoreData.totalScore &&
                          scoreData.totalScore["TIẾNG ANH"] !== undefined
                            ? Math.round(scoreData.totalScore["TIẾNG ANH"])
                            : "-"}
                        </Typography>
                      </Box>

                      {/* Math Score */}
                      <Box
                        sx={{
                          flex: 1,
                          textAlign: "center",
                          p: 3,
                          bgcolor: "#fff8f0",
                          borderRadius: 2,
                          border: "2px solid #ffe0b2",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            fontWeight: 600,
                            mb: 1,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {t("scoreDetails.math")}
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{
                            fontSize: "2.5rem",
                            fontWeight: 800,
                            color: "#f57c00",
                          }}
                        >
                          {/* TOÁN */}
                          {scoreData.totalScore &&
                          scoreData.totalScore["TOÁN"] !== undefined
                            ? Math.round(scoreData.totalScore["TOÁN"])
                            : "-"}
                        </Typography>
                      </Box>
                    </Box>
                    {/* Action Buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={handleSeeScoreDetails}
                        sx={{
                          flex: 1,
                          py: 1.5,
                          borderRadius: 3,
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: "1rem",
                          background:
                            "linear-gradient(135deg, #4a90e2 0%, #357abd 100%)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #357abd 0%, #2c5f8e 100%)",
                          },
                        }}
                      >
                        <TrendingUp sx={{ mr: 1 }} />
                        {t("scoreDetails.seeScoreDetails")}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </>
        ) : null}
      </Container>
    </Box>
  );
}
