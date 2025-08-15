import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  Delete,
  Folder,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function VocabularyCard({
  vocabulary,
  updatingStatus,
  selectedFolder,
  hiddenMeanings,
  onEditVocabulary,
  onDeleteVocabulary,
  handleStatusChange,
  toggleMeaningVisibility,
  getStatusColor,
}) {
  const { t } = useLanguage();
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        boxShadow:
          vocabulary.status === "learned"
            ? "0 4px 16px rgba(76, 175, 80, 0.3)"
            : "0 2px 8px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease-in-out",
        position: "relative",
        overflow: "hidden",
        border:
          vocabulary.status === "learned"
            ? "2px solid #4caf50"
            : "1px solid transparent",
        bgcolor: vocabulary.status === "learned" ? "#f1f8e9" : "#fff",
        "&:hover": {
          boxShadow:
            vocabulary.status === "learned"
              ? "0 6px 20px rgba(76, 175, 80, 0.4)"
              : "0 8px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Box display="flex" flexDirection="column" gap={"0px"}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                color:
                  vocabulary.status === "learned" ? "#4caf50" : "primary.main",
                mb: 0,
                flex: 1,
              }}
            >
              {vocabulary.word}
            </Typography>
            {vocabulary.status === "learned" && (
              <Typography
                variant="caption"
                sx={{
                  bgcolor: "#4caf50",
                  color: "white",
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {t("vocabulary.mastered")}
              </Typography>
            )}
          </Box>

          {vocabulary.pronunciation && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontStyle: "italic", mb: 1 }}
            >
              {vocabulary.pronunciation}
            </Typography>
          )}
        </Box>
        {/* Meaning with hide/show toggle */}
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1.5 }}>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              flex: 1,
              letterSpacing: hiddenMeanings.has(vocabulary._id)
                ? "2px"
                : "normal",
            }}
          >
            {hiddenMeanings.has(vocabulary._id)
              ? "*".repeat(Math.min(vocabulary.meaning.length, 15))
              : vocabulary.meaning}
          </Typography>
          <IconButton
            size="small"
            onClick={() => toggleMeaningVisibility(vocabulary._id)}
            sx={{
              p: 0.5,
              color: "text.secondary",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                color: "primary.main",
                transform: "scale(1.1)",
              },
            }}
          >
            {hiddenMeanings.has(vocabulary._id) ? (
              <VisibilityOff sx={{ fontSize: 16 }} />
            ) : (
              <Visibility sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Box>

        <Box sx={{ mb: 1.5 }}>
          {vocabulary.example && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                fontStyle: "italic",
                bgcolor: "grey.50",
                p: 1,
                borderRadius: 1,
                borderLeft: "2px solid",
                borderLeftColor: "primary.main",
              }}
            >
              <strong>{t("vocabulary.example")}:</strong>{" "}
              {vocabulary.example.length > 50
                ? vocabulary.example.substring(0, 50) + "..."
                : vocabulary.example}
            </Typography>
          )}
        </Box>

        {/* Status Radio Buttons */}
        <Box sx={{ mb: 2 }}>
          <FormControl component="fieldset" size="small">
            <FormLabel
              component="legend"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color:
                  vocabulary.status === "learned" ? "#4caf50" : "text.primary",
                mb: 0.5,
              }}
            >
              {vocabulary.status === "learned"
                ? t("vocabulary.mastered")
                : t("vocabulary.learningStatus")}
            </FormLabel>
            <RadioGroup
              value={vocabulary.status || ""}
              onChange={(e) =>
                handleStatusChange(vocabulary._id, e.target.value)
              }
              sx={{
                gap: 0,
                "& .MuiFormControlLabel-root": {
                  margin: 0,
                  marginBottom: "2px",
                },
              }}
            >
              <FormControlLabel
                value="not_learned"
                control={
                  <Radio
                    size="small"
                    sx={{
                      py: 0.25,
                      color: getStatusColor("not_learned"),
                      "&.Mui-checked": {
                        color: getStatusColor("not_learned"),
                      },
                      "&.Mui-disabled": {
                        color: "grey.300",
                      },
                    }}
                    disabled={
                      updatingStatus[vocabulary._id] ||
                      vocabulary.status === "learned"
                    }
                  />
                }
                label={
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.7rem",
                      color:
                        vocabulary.status === "learned"
                          ? "grey.400"
                          : "inherit",
                    }}
                  >
                    {t("vocabulary.notLearned")}
                  </Typography>
                }
              />
              <FormControlLabel
                value="needs_review"
                control={
                  <Radio
                    size="small"
                    sx={{
                      py: 0.25,
                      color: getStatusColor("needs_review"),
                      "&.Mui-checked": {
                        color: getStatusColor("needs_review"),
                      },
                      "&.Mui-disabled": {
                        color: "grey.300",
                      },
                    }}
                    disabled={
                      updatingStatus[vocabulary._id] ||
                      vocabulary.status === "learned"
                    }
                  />
                }
                label={
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.7rem",
                      color:
                        vocabulary.status === "learned"
                          ? "grey.400"
                          : "inherit",
                    }}
                  >
                    {t("vocabulary.needsReview")}
                  </Typography>
                }
              />
              <FormControlLabel
                value="learned"
                control={
                  <Radio
                    size="small"
                    sx={{
                      py: 0.25,
                      color: getStatusColor("learned"),
                      "&.Mui-checked": {
                        color: getStatusColor("learned"),
                      },
                    }}
                    disabled={updatingStatus[vocabulary._id]}
                  />
                }
                label={
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight:
                        vocabulary.status === "learned" ? 600 : "normal",
                      color:
                        vocabulary.status === "learned" ? "#4caf50" : "inherit",
                    }}
                  >
                    {t("vocabulary.learned")}
                  </Typography>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box sx={{ mt: "auto" }}>
          {!selectedFolder && (
            <Chip
              icon={<Folder sx={{ fontSize: 14 }} />}
              label={vocabulary.folderId?.name || t("vocabulary.uncategorized")}
              size="small"
              sx={{
                mb: 1,
                bgcolor: vocabulary.folderId?.color
                  ? vocabulary.folderId.color + "20"
                  : "grey.100",
                color: vocabulary.folderId?.color || "text.secondary",
                border: `1px solid ${
                  vocabulary.folderId?.color || "transparent"
                }`,
                fontWeight: 500,
                height: 24,
              }}
            />
          )}

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1.5}
          >
            <Button
              size="small"
              variant="outlined"
              onClick={() => onEditVocabulary(vocabulary)}
              disabled={vocabulary.status === "learned"}
              sx={{
                minWidth: 40,
                width: 40,
                height: 40,
                borderRadius: 2,
                borderColor:
                  vocabulary.status === "learned" ? "grey.300" : "primary.main",
                color:
                  vocabulary.status === "learned" ? "grey.400" : "primary.main",
                bgcolor: "transparent",
                "&:hover":
                  vocabulary.status !== "learned"
                    ? {
                        bgcolor: "primary.main",
                        color: "white",
                        borderColor: "primary.main",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 8px rgba(25,118,210,0.3)",
                      }
                    : {},
                "&:disabled": {
                  borderColor: "grey.300",
                  color: "grey.400",
                  cursor: "not-allowed",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Edit sx={{ fontSize: 18 }} />
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onDeleteVocabulary(vocabulary._id)}
              disabled={vocabulary.status === "learned"}
              sx={{
                minWidth: 40,
                width: 40,
                height: 40,
                borderRadius: 2,
                borderColor:
                  vocabulary.status === "learned" ? "grey.300" : "error.main",
                color:
                  vocabulary.status === "learned" ? "grey.400" : "error.main",
                bgcolor: "transparent",
                "&:hover":
                  vocabulary.status !== "learned"
                    ? {
                        bgcolor: "error.main",
                        color: "white",
                        borderColor: "error.main",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 8px rgba(211,47,47,0.3)",
                      }
                    : {},
                "&:disabled": {
                  borderColor: "grey.300",
                  color: "grey.400",
                  cursor: "not-allowed",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Delete sx={{ fontSize: 18 }} />
            </Button>
          </Box>
        </Box>
      </CardContent>

      {/* Loading Overlay */}
      {updatingStatus[vocabulary._id] && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            animation: "fadeIn 0.2s ease-in-out",
            "@keyframes fadeIn": {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CircularProgress
              size={32}
              thickness={4}
              sx={{
                color: "primary.main",
                animation: "pulse 1.5s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.1)" },
                  "100%": { transform: "scale(1)" },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              {t("vocabulary.updating")}
            </Typography>
          </Box>
        </Box>
      )}
    </Card>
  );
}
