import React from "react";
import { Box, Card, CardContent, Typography, Grow } from "@mui/material";
import { FolderOpen } from "@mui/icons-material";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function AllVocabulariesCard({
  selectedFolder,
  onFolderSelect,
  folderRef,
}) {
  const { t } = useLanguage();
  return (
    <Grow in={true} timeout={600}>
      <Card
        ref={folderRef}
        sx={{
          mb: 2,
          cursor: "pointer",
          borderRadius: 2,
          border:
            selectedFolder === null ? "2px solid #f9c571" : "1px solid #e0e0e0",
          bgcolor: selectedFolder === null ? "#f9c57115" : "#fff",
          boxShadow:
            selectedFolder === null
              ? "0 4px 12px #f9c57140"
              : "0 2px 8px rgba(0,0,0,0.08)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow:
              selectedFolder === null
                ? "0 6px 16px #f9c57150"
                : "0 4px 12px #f9c57130",
            transform: "translateY(-3px) scale(1.02)",
            borderColor: "#f9c571",
            bgcolor: selectedFolder === null ? "#f9c57120" : "#f9c57108",
          },
          "&:active": {
            transform: "translateY(-1px) scale(1.01)",
          },
        }}
        onClick={() => onFolderSelect(null)}
      >
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
          <Box display="flex" alignItems="center">
            <FolderOpen
              sx={{
                fontSize: 36,
                color: "#f9c571",
                mr: 2,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1) rotate(5deg)",
                },
              }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{
                  color: "text.primary",
                  transition: "color 0.3s ease-in-out",
                }}
              >
                {t("vocabulary.allVocabularies")}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
}
