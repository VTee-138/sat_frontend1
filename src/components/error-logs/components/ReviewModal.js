import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Alert,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { CheckCircle, Cancel, Quiz, Edit, Save } from "@mui/icons-material";
import { useLanguage } from "../../../contexts/LanguageContext";
import useSectionName from "./useSectionName";
import LogoGridBackground from "../../LogoGridBackground";
import ErrorLogService from "../../../services/ErrorLogService";
import { toast } from "react-toastify";
import MathRenderer from "../../../common/MathRenderer";

export default function ReviewModal({
  open,
  onClose,
  questionData,
  noteData,
  onSave,
  id,
  folderId,
  onRefresh,
}) {
  const { t, currentLanguage } = useLanguage();
  const [noteText, setNoteText] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("needs_review");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const sectionName = useMemo(() => {
    if (!questionData) return "";
    if (questionData.section === "TIẾNG ANH") {
      return t("scoreDetails.readingWriting");
    }
    if (questionData.section === "TOÁN") {
      return t("scoreDetails.math");
    }
    return questionData.section;
  }, [questionData, currentLanguage, t]);

  const handleUpdateNote = async () => {
    setIsSaving(true);
    try {
      await ErrorLogService.updateErrorLog(id, {
        note: noteText.trim(),
        folderId: folderId,
      });
      toast.success(t("errorLogs.noteUpdatedSuccess"));
      setIsEditing(false);
      onRefresh(); // Call onRefresh after successful update
      handleClose();
    } catch (err) {
      console.error("Failed to update note:", err);
      toast.error(t("errorLogs.noteUpdateError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    if (!id || isUpdatingStatus) return;

    const oldStatus = status;
    setStatus(newStatus); // Optimistic update
    setIsUpdatingStatus(true);

    try {
      await ErrorLogService.updateErrorLogStatus(id, newStatus);
      toast.success(t("errorLogs.statusUpdatedSuccess"));
      onRefresh();
      handleClose();
    } catch (err) {
      setStatus(oldStatus); // Revert on error
      console.error("Failed to update status:", err);
      toast.error(t("errorLogs.statusUpdateError"));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSave = () => {
    if (!noteText.trim()) {
      setError("Please enter your notes before saving");
      return;
    }

    setError("");
    // onSave({
    //   note: noteText.trim(),
    //   ...questionData,
    // });
    setNoteText(""); // Clear note text after saving
  };

  const handleClose = () => {
    setNoteText("");
    setError("");
    setIsEditing(false);
    onClose();
  };

  const getSectionColor = (section) => {
    if (section === "TIẾNG ANH") {
      return {
        color: "#1976d2",
        bg: "#e3f2fd",
      };
    }
    return {
      color: "#f57c00",
      bg: "#fff3e0",
    };
  };

  const getAnswerStatusIcon = (isCorrect) => {
    return isCorrect ? (
      <CheckCircle sx={{ color: "#4caf50", fontSize: "1.5rem" }} />
    ) : (
      <Cancel sx={{ color: "#f44336", fontSize: "1.5rem" }} />
    );
  };

  useEffect(() => {
    if (noteData) {
      setNoteText(noteData);
    } else if (questionData && questionData.note) {
      setNoteText(questionData.note);
    }
    setStatus(questionData?.status || "needs_review");
    setIsEditing(false);
  }, [noteData, questionData]);

  if (!questionData) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
          maxWidth: { xs: "95vw", md: "80vw" },
          minWidth: { xs: "95vw", md: "80vw" },
          position: "relative",
        },
      }}
    >
      <LogoGridBackground contained />
      <DialogTitle>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: questionData.isCorrect
                ? "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)"
                : "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
              color: questionData.isCorrect ? "#2e7d32" : "#d32f2f",
              fontWeight: 700,
              fontSize: "1.2rem",
            }}
          >
            <Quiz />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              {questionData.questionNumber} : {questionData.module}
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {sectionName}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <Box display="flex" alignItems="center" gap={0.5}>
                {getAnswerStatusIcon(questionData.isCorrect)}
                <Typography
                  variant="body2"
                  sx={{
                    color: questionData.isCorrect ? "#4caf50" : "#f44336",
                    fontWeight: 600,
                  }}
                >
                  {questionData.isCorrect
                    ? t("scoreDetails.correct") || "Correct"
                    : t("scoreDetails.incorrect") || "Incorrect"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          pt: 2,
          pb: 0,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: { xs: "stretch", md: "flex-start" },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left Column - Question Content */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            zIndex: 1,
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            {t("scoreDetails.question")}
          </Typography>
          <Box
            sx={{
              p: 3,
              bgcolor: "#f8f9fa",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              mb: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.6,
                whiteSpace: "pre-line",
                borderLeft: "3px solid #2196f3",
                pl: "10px",
                mb: 2,
                borderRadius: "6px",
              }}
            >
              <MathRenderer content={questionData?.question.contentQuestions} />
            </Typography>

            {/* {questionData?.question.subQuestion && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "#fff",
                  borderRadius: 1,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="#1976d2"
                >
                  {questionData?.question.subQuestion}
                </Typography>
              </Box>
            )} */}

            {questionData?.question?.imageUrl && (
              <img
                src={questionData?.question?.imageUrl}
                alt="logo"
                style={{
                  objectFit: "cover",
                  margin: "10px auto 0",
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            )}

            {questionData?.question.type === "TN" && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ mb: 1, color: "#666" }}
                >
                  {/* {t("scoreDetails.actions")} */}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {questionData?.question.contentAnswerA && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        backgroundColor:
                          questionData?.yourAnswer === "A"
                            ? questionData?.isCorrect
                              ? "#e8f5e8"
                              : "#ffebee"
                            : "transparent",
                        borderColor:
                          questionData?.yourAnswer === "A"
                            ? questionData?.isCorrect
                              ? "#4caf50"
                              : "#f44336"
                            : "#e0e0e0",
                      }}
                    >
                      <Typography
                        fontWeight={
                          questionData?.yourAnswer === "A" ? 600 : 400
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        A.
                        <MathRenderer
                          content={questionData?.question.contentAnswerA}
                        />
                      </Typography>
                    </Box>
                  )}
                  {questionData?.question.contentAnswerB && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        backgroundColor:
                          questionData?.yourAnswer === "B"
                            ? questionData?.isCorrect
                              ? "#e8f5e8"
                              : "#ffebee"
                            : "transparent",
                        borderColor:
                          questionData?.yourAnswer === "B"
                            ? questionData?.isCorrect
                              ? "#4caf50"
                              : "#f44336"
                            : "#e0e0e0",
                      }}
                    >
                      <Typography
                        fontWeight={
                          questionData?.yourAnswer === "B" ? 600 : 400
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        B.
                        <MathRenderer
                          content={questionData?.question.contentAnswerB}
                        />
                      </Typography>
                    </Box>
                  )}
                  {questionData?.question.contentAnswerC && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        backgroundColor:
                          questionData?.yourAnswer === "C"
                            ? questionData?.isCorrect
                              ? "#e8f5e8"
                              : "#ffebee"
                            : "transparent",
                        borderColor:
                          questionData?.yourAnswer === "C"
                            ? questionData?.isCorrect
                              ? "#4caf50"
                              : "#f44336"
                            : "#e0e0e0",
                      }}
                    >
                      <Typography
                        fontWeight={
                          questionData?.yourAnswer === "C" ? 600 : 400
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        C.
                        <MathRenderer
                          content={questionData?.question.contentAnswerC}
                        />
                      </Typography>
                    </Box>
                  )}
                  {questionData?.question.contentAnswerD && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        backgroundColor:
                          questionData?.yourAnswer === "D"
                            ? questionData?.isCorrect
                              ? "#e8f5e8"
                              : "#ffebee"
                            : "transparent",
                        borderColor:
                          questionData?.yourAnswer === "D"
                            ? questionData?.isCorrect
                              ? "#4caf50"
                              : "#f44336"
                            : "#e0e0e0",
                      }}
                    >
                      <Typography
                        fontWeight={
                          questionData?.yourAnswer === "D" ? 600 : 400
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        D.
                        <MathRenderer
                          content={questionData?.question.contentAnswerD}
                        />
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Right Column - Answer Summary, Explanation & Notes */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            zIndex: 1,
            padding: 2,
            borderRadius: 2,
          }}
        >
          {/* Answer Summary */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              {t("scoreDetails.detailTitle")}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#e3f2fd",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" color="#1976d2" fontWeight={600}>
                  {t("scoreDetails.correctAnswer")}
                </Typography>
                <Typography variant="h4" color="#1976d2" fontWeight={700}>
                  {Array.isArray(questionData.correctAnswer)
                    ? questionData.correctAnswer.join(";")
                    : questionData.correctAnswer}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  bgcolor: questionData.isCorrect ? "#e8f5e8" : "#ffebee",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color={questionData.isCorrect ? "#2e7d32" : "#d32f2f"}
                  fontWeight={600}
                >
                  {t("scoreDetails.yourAnswer")}
                </Typography>
                <Typography
                  variant="h4"
                  color={questionData.isCorrect ? "#2e7d32" : "#d32f2f"}
                  fontWeight={700}
                >
                  {questionData.yourAnswer || t("scoreDetails.notSelected")}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Explanation */}
          {/* {questionData.question?.explanation && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                {t("scoreDetails.explanation")}
              </Typography>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#fff3e0",
                  borderRadius: 2,
                  border: "1px solid #ffcc02",
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  <MathRenderer content={questionData?.question?.explanation} />
                </Typography>
              </Box>
            </Box>
          )} */}

          {/* Explanation section */}
          {questionData.question?.explanation && (
            <div className="p-4 mt-6 mb-6 border-l-4 border-blue-500 rounded-lg bg-blue-50">
              <h3 className="mb-2 text-lg font-semibold text-blue-800">
                📝 {t("scoreDetails.explanation")}:
              </h3>
              <div className="text-gray-700 text-[16px]">
                <MathRenderer content={questionData?.question?.explanation} />
              </div>
            </div>
          )}

          {/* Notes Section */}
          <Box>
            {/* <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              {t("scoreDetails.noteDetail")}
            </Typography> */}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {!isEditing ? (
              <div className="p-4 mt-6 mb-6 border-l-4 border-blue-500 rounded-lg bg-blue-50">
                <h3 className="mb-2 text-lg font-semibold text-blue-800">
                  ✏️ {t("scoreDetails.noteDetail")}:
                </h3>
                <div className="text-gray-700 text-[16px]">{noteText}</div>
              </div>
            ) : (
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder={t("common.description")}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                variant="outlined"
                disabled={!isEditing || isSaving}
                sx={{
                  backgroundColor: "#fff",
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#3954d9",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3954d9",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Radio Button - Status */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  pl: 2,
                  bgcolor: "#f8f9fa",
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <RadioGroup row value={status} onChange={handleStatusChange}>
                  <FormControlLabel
                    value="learned"
                    control={
                      <Radio
                        disabled={isUpdatingStatus}
                        sx={{
                          color: "#4caf50",
                          "&.Mui-checked": { color: "#4caf50" },
                        }}
                      />
                    }
                    label={t("vocabulary.learned")}
                    disabled={isUpdatingStatus}
                  />
                  <FormControlLabel
                    value="needs_review"
                    control={
                      <Radio
                        disabled={isUpdatingStatus}
                        sx={{
                          color: "#f57c00",
                          "&.Mui-checked": { color: "#f57c00" },
                        }}
                      />
                    }
                    label={t("errorLogs.needsReview")}
                    disabled={isUpdatingStatus}
                  />
                </RadioGroup>
                {isUpdatingStatus && (
                  <CircularProgress size={24} sx={{ ml: 2 }} />
                )}
              </Box>

              {/* Edit/Save Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="contained"
                    startIcon={<Edit />}
                    sx={{
                      bgcolor: "#3954d9",
                      "&:hover": { bgcolor: "#2843c7" },
                    }}
                  >
                    {t("common.editNote")}
                  </Button>
                ) : (
                  <Button
                    onClick={handleUpdateNote}
                    variant="contained"
                    disabled={isSaving || !noteText.trim()}
                    startIcon={
                      isSaving ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Save />
                      )
                    }
                    sx={{
                      bgcolor: "#3954d9",
                      "&:hover": { bgcolor: "#2843c7" },
                    }}
                  >
                    {t("common.save")}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2, position: "relative", zIndex: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            backgroundColor: "white",
          }}
        >
          {t("common.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
