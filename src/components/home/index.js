import React from "react";
import { Box, Typography, Card, CardContent, Grid, Stack } from "@mui/material";
import { Edit, Psychology, MenuBook, ErrorOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import { getUserInfo } from "../../services/AuthService";
import { useLanguage } from "../../contexts/LanguageContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const userInfo = getUserInfo();
  const userName = userInfo?.fullName || "Student Name";

  const features = [
    {
      title: t("home.practiceTests"),
      icon: <Edit sx={{ fontSize: 100, color: "#1976d2" }} />,
      description: t("home.practiceTestsDescription"),
      onClick: () => navigate("/exam-list"),
    },
    {
      title: t("home.examSystem"),
      icon: <Psychology sx={{ fontSize: 100, color: "#1976d2" }} />,
      description: t("home.examDescription"),
      onClick: () => {
        navigate("/practice");
      },
    },
    {
      title: t("home.vocabularyManager"),
      icon: <MenuBook sx={{ fontSize: 100, color: "#1976d2" }} />,
      description: t("home.vocabularyDescription"),
      onClick: () => navigate("/vocabulary-manager"),
    },
    {
      title: t("home.examDiscovery"),
      icon: <ErrorOutline sx={{ fontSize: 100, color: "#d32f2f" }} />,
      description: t("home.examDiscoveryDescription"),
      onClick: () => navigate("/error-logs"),
    },
  ];

  return (
    <Box>
      <Header />

      {/* Main Content */}
      <Box
        sx={{
          pt: "80px",
          px: { xs: 2, sm: 4 },
          py: 4,
          mt: "60px",
          minHeight: "calc(100vh - 60px)",
        }}
      >
        {/* Welcome Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#333",
              mb: 2,
              fontSize: { xs: "2rem", sm: "2.5rem" },
            }}
          >
            {t("home.welcome")}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#666",
              mb: 1,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            {t("home.greeting")}, <strong>{userName}!</strong>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#888",
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            {t("home.subtitle")}
          </Typography>
        </Box>

        {/* Feature Cards */}
        <Stack
          direction={"row"}
          flexWrap={"wrap"}
          gap={"12px"}
          justifyContent="center"
          maxWidth="992px"
          sx={{ mx: "auto", width: "100%" }}
        >
          {features.map((feature, index) => (
            <Box
              item
              xs={6}
              sm={3}
              key={index}
              sx={{
                cursor: "pointer",
                p: "0 !important",
                maxWidth: {
                  xs: "calc(50% - 6px) !important",
                  md: "calc(25% - 9px) !important",
                },
                width: "100%",
              }}
            >
              <Card
                sx={{
                  height: "200px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  p: 3,
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                }}
                onClick={feature.onClick}
              >
                <CardContent sx={{ p: 0, pb: "0 !important" }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#333",
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                    }}
                  >
                    {feature.title}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
