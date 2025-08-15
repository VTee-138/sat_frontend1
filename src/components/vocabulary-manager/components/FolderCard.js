import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grow,
} from "@mui/material";
import { Edit, Delete, Folder } from "@mui/icons-material";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function FolderCard({
  folder,
  index,
  selectedFolder,
  onFolderSelect,
  onEditFolder,
  onDeleteFolder,
  folderRef,
}) {
  const { t } = useLanguage();
  const hasVocabulary = (folder.vocabularyCount || 0) > 0;
  const folderColor = folder.color || (hasVocabulary ? "#ff9800" : "#9e9e9e");
  const isSelected = selectedFolder === folder._id;

  return (
    <Grow
      in={true}
      timeout={700 + index * 100}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <Card
        ref={folderRef}
        sx={{
          cursor: "pointer",
          borderRadius: 2,
          border: isSelected ? `2px solid ${folderColor}` : "1px solid #e0e0e0",
          bgcolor: isSelected ? `${folderColor}15` : "#fff",
          boxShadow: isSelected
            ? `0 4px 12px ${folderColor}40`
            : "0 2px 8px rgba(0,0,0,0.08)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: isSelected
              ? `0 8px 20px ${folderColor}50`
              : `0 6px 16px ${folderColor}30`,
            transform: "translateY(-4px) scale(1.02)",
            borderColor: folderColor,
            bgcolor: isSelected ? `${folderColor}20` : `${folderColor}08`,
          },
          "&:active": {
            transform: "translateY(-2px) scale(1.01)",
          },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${folderColor}20, transparent)`,
            transition: "left 0.5s ease-in-out",
          },
          "&:hover::before": {
            left: "100%",
          },
        }}
        onClick={() => onFolderSelect(folder._id)}
      >
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
            sx={{
              width: "100%",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              display="flex"
              alignItems="flex-start"
              sx={{
                flex: 1,
                minWidth: 0,
                pr: 1,
              }}
            >
              <Folder
                sx={{
                  fontSize: 36,
                  color: folderColor,
                  mr: 2,
                  mt: 0.25,
                  flexShrink: 0,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.1) rotate(5deg)",
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                  },
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  title={folder.name}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "140px",
                    cursor: "help",
                    color: "text.primary",
                    transition: "color 0.3s ease-in-out",
                    "&:hover": {
                      color: folderColor,
                    },
                  }}
                >
                  {folder.name}
                </Typography>

                {folder.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    title={folder.description}
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: 1.4,
                      maxWidth: "140px",
                      mb: 1,
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      transition: "color 0.3s ease-in-out",
                      "&:hover": {
                        color: "text.primary",
                      },
                    }}
                  >
                    {folder.description}
                  </Typography>
                )}

                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="500"
                  sx={{
                    bgcolor: "rgba(0,0,0,0.04)",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: "inline-block",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      bgcolor: `${folderColor}20`,
                      color: folderColor,
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {folder.vocabularyCount || 0} {t("vocabulary.words")}
                </Typography>
              </Box>
            </Box>

            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                display: "flex",
                gap: 0.5,
                flexShrink: 0,
                alignSelf: "flex-start",
                opacity: 0.7,
                transition: "opacity 0.3s ease-in-out",
                "&:hover": {
                  opacity: 1,
                },
              }}
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditFolder(folder);
                }}
                sx={{
                  p: 0.75,
                  borderRadius: 1.5,
                  color: "text.secondary",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    color: "primary.main",
                    bgcolor: "primary.main",
                    color: "white",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFolder(folder._id);
                }}
                sx={{
                  p: 0.75,
                  borderRadius: 1.5,
                  color: "text.secondary",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    color: "error.main",
                    bgcolor: "error.main",
                    color: "white",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
}
