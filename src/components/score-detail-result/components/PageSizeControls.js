import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useLanguage } from "../../../contexts/LanguageContext";

const PAGE_SIZE_OPTIONS = [10, 20, 30];

export default function PageSizeControls({
  pageSize,
  onPageSizeChange,
  totalItems,
}) {
  const { t } = useLanguage();

  const handlePageSizeChange = (size) => {
    onPageSizeChange(size);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 3,
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Typography sx={{ fontWeight: 600, color: "#666" }}>
        {t("scoreDetails.view") || "View:"}
      </Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        {PAGE_SIZE_OPTIONS.map((size) => (
          <Button
            key={size}
            variant={pageSize === size ? "contained" : "outlined"}
            size="small"
            onClick={() => handlePageSizeChange(size)}
            sx={{
              minWidth: "50px",
              borderRadius: 2,
              ...(pageSize === size && {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                },
              }),
            }}
          >
            {size}
          </Button>
        ))}
        <Button
          variant={pageSize === totalItems ? "contained" : "outlined"}
          size="small"
          onClick={() => handlePageSizeChange(totalItems)}
          sx={{
            borderRadius: 2,
            ...(pageSize === totalItems && {
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              },
            }),
          }}
        >
          {t("scoreDetails.all") || "All"}
        </Button>
      </Box>
    </Box>
  );
}
