import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useLanguage } from "../../../contexts/LanguageContext";

const LoadMore = ({
  onLoadMore,
  hasMore,
  loading,
  currentPage,
  totalPages,
}) => {
  const { t } = useLanguage();

  // Don't render if no more items to load
  if (!hasMore || currentPage >= totalPages) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 6,
        mb: 4,
        px: { xs: 1, sm: 0 },
      }}
    >
      <Button
        onClick={onLoadMore}
        disabled={loading}
        variant="outlined"
        size="large"
        sx={{
          minWidth: "200px",
          height: "50px",
          borderRadius: "25px",
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 600,
          borderColor: "#2563eb",
          color: "#2563eb",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: "#1d4ed8",
            backgroundColor: "rgba(37, 99, 235, 0.05)",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(37, 99, 235, 0.15)",
          },
          "&:disabled": {
            borderColor: "#cbd5e1",
            color: "#94a3b8",
            transform: "none",
            boxShadow: "none",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.1), transparent)",
            transition: "left 0.6s",
          },
          "&:hover::before": {
            left: "100%",
          },
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            <span>{t("examList.loading") || "Đang tải..."}</span>
          </Box>
        ) : (
          t("examList.loadMore") || "Tải thêm"
        )}
      </Button>
    </Box>
  );
};

export default LoadMore;
