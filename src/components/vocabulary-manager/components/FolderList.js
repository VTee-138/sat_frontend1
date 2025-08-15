import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Grid,
  Divider,
  TextField,
  InputAdornment,
  useMediaQuery,
  Fade,
  Slide,
  IconButton,
} from "@mui/material";
import { CreateNewFolder, Search, Clear, Close } from "@mui/icons-material";
import AllVocabulariesCard from "./AllVocabulariesCard";
import FolderCard from "./FolderCard";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function FolderList({
  folders,
  loading,
  selectedFolder,
  vocabularies,
  onFolderSelect,
  onCreateFolder,
  onEditFolder,
  onDeleteFolder,
  isMobile = false,
  mobileOpen = false,
  onClose,
}) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const isTablet = useMediaQuery("(max-width: 992px)");
  const folderRefs = useRef({});

  // Filter folders based on search term
  const filteredFolders = folders.filter((folder) => {
    const searchLower = searchTerm.toLowerCase();
    return folder.name.toLowerCase().includes(searchLower);
  });

  // Auto-scroll to selected folder
  useEffect(() => {
    if (selectedFolder && folderRefs.current[selectedFolder]) {
      const timer = setTimeout(() => {
        folderRefs.current[selectedFolder]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 300); // Small delay to ensure elements are rendered

      return () => clearTimeout(timer);
    } else if (
      selectedFolder === null &&
      folderRefs.current["all-vocabularies"]
    ) {
      // Scroll to "All Vocabularies" when selectedFolder is null
      const timer = setTimeout(() => {
        folderRefs.current["all-vocabularies"]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [selectedFolder, filteredFolders.length]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Auto-scroll to top when search term changes
  useEffect(() => {
    if (searchTerm && folderRefs.current["all-vocabularies"]) {
      const timer = setTimeout(() => {
        folderRefs.current["all-vocabularies"]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  const SidebarContent = (
    <Box
      sx={{
        width: isTablet ? 300 : 320,
        borderRight: isMobile ? "none" : "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        boxShadow: isMobile
          ? "0 0 20px rgba(0,0,0,0.3)"
          : "inset -1px 0 0 rgba(0,0,0,0.12)",
        bgcolor: "#fff",
        height: "100%",
        ...(!isMobile && {
          flexShrink: 0,
        }),
      }}
    >
      {/* Header */}
      <Fade in={true} timeout={500}>
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid #e0e0e0",
            bgcolor: "#fff",
            position: "relative",
            ...(isMobile && {
              pt: 5, // Add extra padding top for mobile to account for status bar
            }),
          }}
        >
          {/* Close button for mobile */}
          {isMobile && (
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                top: isMobile ? 16 : 8,
                right: 8,
                zIndex: 1,
                bgcolor: "#f5f5f5",
                color: "#666",
                width: 36,
                height: 36,
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  bgcolor: "#ff5252",
                  color: "#fff",
                  transform: "scale(1.1)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          )}

          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: "text.primary",
              fontWeight: 600,
              transform: "translateY(0)",
              transition: "transform 0.3s ease-in-out",
              pr: isMobile ? 6 : 0, // Add padding right for close button
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            {t("vocabulary.personalVocabulary")}
          </Typography>
          <Button
            variant="contained"
            startIcon={<CreateNewFolder />}
            fullWidth
            onClick={onCreateFolder}
            sx={{
              borderRadius: 2,
              py: 1.5,
              mb: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            {t("vocabulary.createFolder")}
          </Button>

          {/* Search Input */}
          <TextField
            fullWidth
            placeholder={t("vocabulary.searchFolders")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#f5f5f5",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  bgcolor: "#f0f0f0",
                  transform: "translateY(-1px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                },
                "&.Mui-focused": {
                  bgcolor: "#fff",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color: "text.secondary",
                      fontSize: 20,
                      transition: "color 0.3s ease-in-out",
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <Fade in={Boolean(searchTerm)}>
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      sx={{
                        p: 0.5,
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,0.04)",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <Clear sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                </Fade>
              ),
            }}
          />
        </Box>
      </Fade>

      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {/* Show All Folders Option */}
        <AllVocabulariesCard
          selectedFolder={selectedFolder}
          onFolderSelect={onFolderSelect}
          folderRef={(el) => {
            if (el) {
              folderRefs.current["all-vocabularies"] = el;
            }
          }}
        />

        <Divider sx={{ my: 2 }} />

        {loading ? (
          <Fade in={loading}>
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress
                sx={{
                  animation: "pulse 1.5s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%": {
                      transform: "scale(1)",
                    },
                    "50%": {
                      transform: "scale(1.1)",
                    },
                    "100%": {
                      transform: "scale(1)",
                    },
                  },
                }}
              />
            </Box>
          </Fade>
        ) : (
          <>
            {searchTerm && (
              <Fade in={Boolean(searchTerm)} timeout={300}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    px: 1,
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      color: "text.primary",
                    },
                  }}
                >
                  {filteredFolders.length} {t("vocabulary.folderFound")}
                </Typography>
              </Fade>
            )}

            {filteredFolders.length === 0 && searchTerm ? (
              <Fade
                in={filteredFolders.length === 0 && Boolean(searchTerm)}
                timeout={400}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  p={4}
                  sx={{ textAlign: "center" }}
                >
                  <Search
                    sx={{
                      fontSize: 48,
                      color: "text.disabled",
                      mb: 2,
                      animation: "bounce 2s ease-in-out infinite",
                      "@keyframes bounce": {
                        "0%, 100%": {
                          transform: "translateY(0)",
                        },
                        "50%": {
                          transform: "translateY(-10px)",
                        },
                      },
                    }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t("vocabulary.noFoldersFound")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("vocabulary.tryAdjustingSearch")}
                  </Typography>
                </Box>
              </Fade>
            ) : (
              <Grid container spacing={2}>
                {filteredFolders.map((folder, index) => (
                  <Grid item xs={12} key={folder._id}>
                    <FolderCard
                      folder={folder}
                      index={index}
                      selectedFolder={selectedFolder}
                      onFolderSelect={onFolderSelect}
                      onEditFolder={onEditFolder}
                      onDeleteFolder={onDeleteFolder}
                      folderRef={(el) => {
                        if (el) {
                          folderRefs.current[folder._id] = el;
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
    </Box>
  );

  // Return with conditional animation based on mobile state
  if (isMobile) {
    return (
      <Slide
        direction="right"
        in={mobileOpen}
        timeout={400}
        easing={{
          enter: "cubic-bezier(0.4, 0, 0.2, 1)",
          exit: "cubic-bezier(0.4, 0, 0.6, 1)",
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1300,
          height: "100vh",
        }}
      >
        <Box
          sx={{
            height: "100%",
            pointerEvents: mobileOpen ? "auto" : "none",
          }}
        >
          {SidebarContent}
        </Box>
      </Slide>
    );
  }

  // Desktop: Return without slide animation
  return SidebarContent;
}
