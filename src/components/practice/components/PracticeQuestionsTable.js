import React, { useState } from "react";
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
import PracticeReviewModal from "./PracticeReviewModal";

export default function PracticeQuestionsTable({
  data,
  page,
  pageSize,
  onPageChange,
  totalItems,
  onRefresh,
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
    noteData: null,
    id: null,
  });

  // Handle review button click
  const handleReviewClick = (questionData) => {
    setReviewModal({
      open: true,
      noteData: questionData.note,
      questionData: {
        ...questionData.questionData,
        selectedAnswer: questionData.selectedAnswer,
      },
      id: questionData._id,
    });
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
      <Box
        sx={{
          position: "relative",
          isolation: "isolate",
          zIndex: 1,
          "& *": {
            border: "none !important",
            "&.MuiTableCell-root": {
              borderBottom: "1px solid rgba(224, 224, 224, 1) !important",
            },
            "&.MuiTableCell-head": {
              borderBottom: "none !important",
            },
          },
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            overflowX: "auto",
            overflowY: "hidden",
            position: "relative",
            isolation: "isolate",
            zIndex: 1,
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
          <Table
            sx={{
              minWidth: 650,
              border: "none !important",
              "& .MuiTableRow-root": {
                border: "none !important",
              },
              "& .MuiTableCell-root": {
                border: "none !important",
                borderBottom: "1px solid rgba(224, 224, 224, 1) !important",
              },
              "& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root": {
                border: "none !important",
                borderBottom: "none !important",
              },
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(135deg, #f44336 0%, #e91e63 100%)",
                  "& .MuiTableCell-head": {
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1rem",
                    borderBottom: "none",
                  },
                }}
              >
                <TableCell align="center">#</TableCell>
                <TableCell>{t("scoreDetails.question")}</TableCell>
                <TableCell align="center">
                  {t("scoreDetails.section")}
                </TableCell>
                {/* <TableCell align="center">{t("scoreDetails.result")}</TableCell> */}
                <TableCell align="center">
                  {t("scoreDetails.yourAnswer")}
                </TableCell>
                <TableCell align="center">
                  {t("scoreDetails.correctAnswer")}
                </TableCell>
                <TableCell align="center">
                  {t("scoreDetails.actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => {
                const questionNumber = (page - 1) * pageSize + index + 1;
                const isCorrect = item.isCorrect;
                const sectionColors = getSectionColor(
                  item.questionData?.section
                );

                return (
                  <TableRow
                    key={item._id}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "#f8f9fa",
                      },
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                        transform: "translateY(-1px)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        color: "#1565c0",
                        fontSize: "1rem",
                      }}
                    >
                      {questionNumber}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ maxWidth: 200 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.4,
                          }}
                        >
                          {item.questionData?.question?.replace(
                            /<[^>]*>/g,
                            ""
                          ) || "No question text"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={sectionName(item.questionData?.section)}
                        sx={{
                          bgcolor: sectionColors.bg,
                          color: sectionColors.color,
                          fontWeight: 600,
                          border: `1px solid ${sectionColors.color}`,
                          borderRadius: 2,
                        }}
                        size="small"
                      />
                    </TableCell>
                    {/* <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {getAnswerStatusIcon(isCorrect)}
                      </Box>
                    </TableCell> */}
                    <TableCell align="center">
                      <Chip
                        label={
                          item.selectedAnswer || t("scoreDetails.notSelected")
                        }
                        sx={{
                          bgcolor: isCorrect ? "#e8f5e8" : "#ffebee",
                          color: isCorrect ? "#2e7d32" : "#c62828",
                          fontWeight: 600,
                          border: `1px solid ${
                            isCorrect ? "#4caf50" : "#f44336"
                          }`,
                          borderRadius: 2,
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.questionData?.correctAnswer || "N/A"}
                        sx={{
                          bgcolor: "#e8f5e8",
                          color: "#2e7d32",
                          fontWeight: 600,
                          border: "1px solid #4caf50",
                          borderRadius: 2,
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleReviewClick(item)}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          borderColor: "#f44336",
                          color: "#f44336",
                          "&:hover": {
                            borderColor: "#e91e63",
                            backgroundColor: "#ffebee",
                            color: "#e91e63",
                          },
                        }}
                      >
                        {t("scoreDetails.review")}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pagination */}
      {totalItems > pageSize && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
            "& .MuiPagination-root": {
              "& .MuiPaginationItem-root": {
                "&.Mui-selected": {
                  background:
                    "linear-gradient(135deg, #f44336 0%, #e91e63 100%)",
                  color: "white",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #e91e63 0%, #f44336 100%)",
                  },
                },
              },
            },
          }}
        >
          <Pagination
            count={Math.ceil(totalItems / pageSize)}
            page={page}
            onChange={(_, value) => onPageChange(value)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Review Modal */}
      <PracticeReviewModal
        open={reviewModal.open}
        onClose={() =>
          setReviewModal({
            open: false,
            questionData: null,
            noteData: null,
          })
        }
        questionData={reviewModal.questionData}
        noteData={reviewModal.noteData}
        id={reviewModal.id}
        onRefresh={onRefresh}
      />
    </>
  );
}
