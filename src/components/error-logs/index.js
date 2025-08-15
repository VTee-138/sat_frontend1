import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  CardActionArea,
  useTheme,
  useMediaQuery,
  Fade,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Folder as FolderIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import { useLanguage } from "../../contexts/LanguageContext";
import FolderQuestionService from "../../services/FolderQuestionService";
import { toast } from "react-toastify";

// Predefined color palette for folders
const colorPalette = [
  { color: "#4285F4", lightColor: "#EAF1FF" }, // Google Blue
  { color: "#34A853", lightColor: "#E6F4EA" }, // Google Green
  { color: "#FBBC05", lightColor: "#FFF8E1" }, // Google Yellow
  { color: "#EA4335", lightColor: "#FCE8E6" }, // Google Red
  { color: "#FF6B6B", lightColor: "#FFE5E5" }, // A nice red
  { color: "#4ECDC4", lightColor: "#E8F8F7" }, // A nice cyan
  { color: "#45B7D1", lightColor: "#E8F4F8" }, // A nice blue
  { color: "#9B59B6", lightColor: "#F5EEF8" }, // A nice purple
  { color: "#F39C12", lightColor: "#FEF5E7" }, // A nice orange
  { color: "#1ABC9C", lightColor: "#E8F8F5" }, // A nice teal
  { color: "#E91E63", lightColor: "#FCE4EC" }, // A nice pink
  { color: "#303F9F", lightColor: "#E8EAF6" }, // A deep blue
  { color: "#8BC34A", lightColor: "#F1F8E9" }, // Lime Green
  { color: "#5C6BC0", lightColor: "#E8EAF6" }, // Indigo
  { color: "#795548", lightColor: "#EFEBE9" }, // Brown
  { color: "#607D8B", lightColor: "#ECEFF1" }, // Blue Grey
  { color: "#673AB7", lightColor: "#EDE7F6" }, // Deep Purple
  { color: "#03A9F4", lightColor: "#E1F5FE" }, // Light Blue
  { color: "#FF5722", lightColor: "#FBE9E7" }, // Deep Orange
  { color: "#009688", lightColor: "#E0F2F1" }, // Teal
];

export default function ErrorLogsPage() {
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [folderData, setFolderData] = useState([]);

  const fetchFolderQuestions = async () => {
    try {
      setLoading(true);
      const response = await FolderQuestionService.getFolderQuestions(1, 20);
      // Gán màu ngẫu nhiên cho mỗi thư mục
      const dataWithColors = (response.data || []).map((folder) => ({
        ...folder,
        ...colorPalette[Math.floor(Math.random() * colorPalette.length)],
      }));
      setFolderData(dataWithColors);
    } catch (error) {
      console.error("Error fetching folder questions:", error);
      toast.error(t("errors.somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (folder) => {
    navigate(`/error-logs/${folder._id}`, {
      state: {
        folderName: folder.name,
        folderColor: folder.color,
        folderLightColor: folder.lightColor,
      },
    });
  };

  useEffect(() => {
    fetchFolderQuestions();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Header />
      <Container
        maxWidth="lg"
        sx={{
          pt: "80px",
          pb: 6,
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: "#1a237e",
              mb: 2,
              fontSize: { xs: "2.2rem", md: "3rem" },
            }}
          >
            {t("errorLogs.title")}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#546e7a",
              fontSize: { xs: "1rem", md: "1.25rem" },
              fontWeight: 400,
            }}
          >
            {t("errorLogs.subtitle")}
          </Typography>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress size={50} />
          </Box>
        )}

        {/* Folder-like Cards Grid */}
        {!loading && (
          <Fade in={!loading} timeout={500}>
            <Grid container spacing={{ xs: 2, md: 4 }}>
              {folderData.map((folder, index) => {
                return (
                  <Grid item xs={12} sm={6} md={3} key={folder._id}>
                    <Fade
                      in={!loading}
                      timeout={500}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          height: "100%",
                          borderRadius: 3,
                          background: "#fff",
                          overflow: "hidden",
                          position: "relative",
                          border: "1px solid #e0e0e0",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                          transition:
                            "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                          cursor: "pointer",
                          "&:hover": {
                            transform: "translateY(-6px) scale(1.01)",
                            boxShadow: `0 12px 24px rgba(0,0,0,0.1)`,
                            borderColor: folder.color,
                          },
                        }}
                      >
                        <CardActionArea
                          onClick={() => handleCategoryClick(folder)}
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            p: { xs: 3, md: 4 },
                            textAlign: "center",
                          }}
                        >
                          {/* Folder Icon */}
                          <Box
                            sx={{
                              width: { xs: 70, md: 80 },
                              height: { xs: 70, md: 80 },
                              borderRadius: "50%",
                              background: folder.lightColor,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 3,
                            }}
                          >
                            <FolderIcon
                              sx={{
                                fontSize: { xs: 36, md: 44 },
                                color: folder.color,
                              }}
                            />
                          </Box>

                          {/* Category Title */}
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: "#37474f",
                              textAlign: "center",
                              lineHeight: 1.4,
                              fontSize: "1rem",
                              mb: 0.5,
                            }}
                          >
                            {folder.name}
                          </Typography>

                          {/* Subtitle */}
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#7f8c8d",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                            }}
                          >
                            {folder.questionCount} {t("errorLogs.question")}
                          </Typography>
                        </CardActionArea>
                      </Paper>
                    </Fade>
                  </Grid>
                );
              })}
            </Grid>
          </Fade>
        )}
      </Container>
    </Box>
  );
}
