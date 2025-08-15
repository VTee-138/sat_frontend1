import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  Chip,
} from "@mui/material";
import { CheckCircle, Cancel, Visibility } from "@mui/icons-material";
import { useLanguage } from "../../../contexts/LanguageContext";
import ReviewModal from "./ReviewModal";
import FolderSelectionModal from "./FolderSelectionModal";

export default function QuestionsTable({
  data,
  page,
  pageSize,
  onPageChange,
  totalItems,
}) {
  const { t, currentLanguage } = useLanguage();

  const sectionName = (value) => {
    if (value === "TIẾNG ANH") {
      return currentLanguage === "en" ? "R&W" : "Đọc & Viết";
    }
    if (value === "TOÁN") {
      return currentLanguage === "en" ? "Math" : "Toán";
    }
    return value;
  };

  // Modal states
  const [reviewModal, setReviewModal] = useState({
    open: false,
    questionData: null,
    isCorrect: null,
  });

  const [folderModal, setFolderModal] = useState({
    open: false,
    noteData: null,
    isCorrect: null,
  });

  // Handle review button click
  const handleReviewClick = (questionData) => {
    setReviewModal({
      open: true,
      questionData: questionData,
      isCorrect: questionData.isCorrect,
    });
  };

  // Handle save notes from ReviewModal
  const handleSaveNotes = (noteData) => {
    // setReviewModal({ open: false, questionData: null });
    setFolderModal({
      open: true,
      noteData: noteData,
    });
    // Không tắt reviewModal, để cả hai modal cùng mở
  };

  // Handle save to folder completion
  const handleSaveToFolderComplete = (result) => {
    setFolderModal({ open: false, noteData: null });
    setReviewModal({ open: false, questionData: null });
  };

  const getAnswerStatusIcon = (isCorrect) => {
    return isCorrect ? (
      <CheckCircle sx={{ color: "#4caf50", fontSize: "1.2rem" }} />
    ) : (
      <Cancel sx={{ color: "#f44336", fontSize: "1.2rem" }} />
    );
  };

  const getSectionColor = (section) => {
    if (section === "TIẾNG ANH") {
      return {
        bg: "white",
        color: "#1976d2",
      };
    }
    return {
      bg: "white",
      color: "#f57c00",
    };
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          overflowX: "auto",
          overflowY: "hidden",
          "& .MuiTable-root": {
            border: "none !important",
          },
          "& .MuiTableCell-root": {
            border: "none !important",
            borderBottom: "1px solid rgba(224, 224, 224, 1) !important",
          },
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: "4px",
            "&:hover": {
              background: "#a8a8a8",
            },
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
              }}
            >
              <TableCell sx={{ fontWeight: 700, fontSize: "1rem", py: 2 }}>
                {t("scoreDetails.question") || "Question"}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "1rem", py: 2 }}>
                {t("scoreDetails.section") || "Section"}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "1rem", py: 2 }}>
                {t("scoreDetails.correctAnswer") || "Correct Answer"}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "1rem", py: 2 }}>
                {t("scoreDetails.yourAnswer") || "Your Answer"}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "1rem", py: 2 }}>
                {t("scoreDetails.answerChoice") || "Status"}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "1rem", py: 2 }}>
                {t("scoreDetails.actions") || "Actions"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => {
              const sectionColors = getSectionColor(row.section);
              return (
                <TableRow
                  key={row.questionNumber || idx}
                  sx={{
                    "&:hover": {
                      // transform: "scale(1.01)",
                      transition: "all 0.2s ease",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "5px",
                        borderRadius: "50%",
                        background: "white",
                        color: row.isCorrect ? "#2e7d32" : "#d32f2f",
                        fontWeight: 700,
                        fontSize: "1rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.questionNumber}
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "14px" }}
                        color={"black"}
                        fontWeight={700}
                      >
                        : {row.module}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={sectionName(row?.section)}
                      sx={{
                        background: sectionColors.bg,
                        color: sectionColors.color,
                        fontWeight: 600,
                        border: `1px solid ${sectionColors.border}`,
                        fontSize: "0.875rem",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "35px",
                        height: "35px",
                        borderRadius: "8px",
                        background: "white",
                        color: "#1976d2",
                        fontWeight: 700,
                        fontSize: "1rem",
                      }}
                    >
                      {Array.isArray(row.correctAnswer)
                        ? row.correctAnswer.join(";")
                        : row.correctAnswer}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    {row.yourAnswer ? (
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "35px",
                          height: "35px",
                          borderRadius: "8px",
                          background: "white",
                          color: row.isCorrect ? "#2e7d32" : "#d32f2f",
                          fontWeight: 700,
                          fontSize: "1rem",
                        }}
                      >
                        {row.yourAnswer}
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontStyle: "italic" }}
                      >
                        {t("scoreDetails.notSelected")}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {getAnswerStatusIcon(row.isCorrect)}
                      <Typography
                        variant="body2"
                        sx={{
                          color: row.isCorrect ? "#4caf50" : "#f44336",
                          fontWeight: 600,
                        }}
                      >
                        {row.isCorrect
                          ? t("scoreDetails.correct") || "Correct"
                          : t("scoreDetails.incorrect") || "Incorrect"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => handleReviewClick(row)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#667eea",
                        color: "#667eea",
                      }}
                    >
                      {t("scoreDetails.review") || "Review"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={Math.ceil(totalItems / pageSize) || 1}
          page={page}
          onChange={(_, v) => onPageChange(v)}
          color="primary"
          size="large"
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: 2,
              fontWeight: 600,
              "&.Mui-selected": {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                },
              },
            },
          }}
        />
      </Box>

      {/* Review Modal */}
      <ReviewModal
        open={reviewModal.open}
        onClose={() => setReviewModal({ open: false, questionData: null })}
        questionData={reviewModal.questionData}
        onSave={handleSaveNotes}
        isCorrect={reviewModal.isCorrect}
      />

      {/* Folder Selection Modal */}
      {folderModal.open && (
        <FolderSelectionModal
          open={folderModal.open}
          onClose={() => setFolderModal({ open: false, noteData: null })}
          noteData={folderModal.noteData}
          onSaveComplete={handleSaveToFolderComplete}
          isCorrect={reviewModal.isCorrect}
        />
      )}
    </>
  );
}
