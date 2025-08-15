import React from "react";
import { Box, Pagination } from "@mui/material";

const ExamPagination = ({ totalPages, page, onPageChange }) => {
  // Convert to numbers and validate
  const validTotalPages = Number(totalPages) || 1;
  const validPage = Number(page) || 1;

  // Don't render if only one page or invalid values
  if (validTotalPages <= 1 || validPage < 1 || validPage > validTotalPages) {
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
      <Pagination
        count={validTotalPages}
        page={validPage}
        onChange={onPageChange}
        color="primary"
        size="medium"
        sx={{
          "& .MuiPaginationItem-root": {
            fontSize: { xs: "0.875rem", sm: "1rem" },
            minWidth: { xs: "32px", sm: "40px" },
            height: { xs: "32px", sm: "40px" },
          },
          "& .MuiPaginationItem-page.Mui-selected": {
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          },
        }}
      />
    </Box>
  );
};

export default ExamPagination;
