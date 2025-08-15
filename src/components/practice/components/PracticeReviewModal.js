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
import { toast } from "react-toastify";
import MathRenderer from "../../../common/MathRenderer";
import LogoGridBackground from "../../LogoGridBackground";
import {
  updatePracticeStatus,
  updatePracticeNote,
} from "../../../services/PracticeResultService";

export default function PracticeReviewModal({
  open,
  onClose,
  questionData,
  noteData,
  id,
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
  }, [questionData, t]);

  const handleUpdateNote = async () => {
    setIsSaving(true);
    try {
      // Call the API to update note
      const response = await updatePracticeNote({
        id: id, // Practice result ID
        note: noteText.trim(),
      });

      toast.success(t("practice.noteUpdatedSuccess"));
      setIsEditing(false);

      // Call onRefresh if available to reload the data
      if (onRefresh) {
        onRefresh();
      }

      // Close modal after successful update
      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (err) {
      console.error("Failed to update note:", err);
      toast.error(t("practice.noteUpdateError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    if (!id || isUpdatingStatus) return;

    const oldStatus = status;
    setStatus(newStatus);
    setIsUpdatingStatus(true);

    try {
      // Map the status values to match API expectations
      const apiStatus = newStatus === "reviewed" ? "learned" : "need_to_review";

      await updatePracticeStatus({
        id: id,
        status: apiStatus,
      });

      toast.success(
        t("practice.statusUpdatedSuccess") || "Cập nhật trạng thái thành công"
      );
      setIsUpdatingStatus(false);

      // Call onRefresh if available to reload the data
      if (onRefresh) {
        onRefresh();
      }

      // Close modal after successful update
      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (err) {
      setStatus(oldStatus);
      toast.error(
        t("practice.statusUpdateError") ||
          "Có lỗi xảy ra khi cập nhật trạng thái"
      );
      setIsUpdatingStatus(false);
    }
  };

  const handleSave = () => {
    if (!noteText.trim()) {
      setError("Please enter your notes before saving");
      return;
    }
    setError("");
    handleUpdateNote();
  };

  const handleClose = () => {
    setNoteText("");
    setError("");
    setIsEditing(false);
    onClose();
  };

  useEffect(() => {
    if (open) {
      // Set note text from noteData
      setNoteText(noteData || "");
      setStatus("needs_review");
    }
  }, [open, noteData]);

  if (!questionData) return null;

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

  const sectionColors = getSectionColor(questionData.section);

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
              {t("practice.reviewQuestion")}
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
            {t("practice.questionContent")}
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
              <MathRenderer content={questionData.question} />
            </Typography>

            {/* Answer Options */}
            {questionData.answers && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ mb: 1, color: "#666" }}
                >
                  {t("practice.answerOptions")}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {Object.entries(questionData.answers).map(([key, value]) => (
                    <Box
                      key={key}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        backgroundColor:
                          key === questionData.correctAnswer
                            ? "#e8f5e8"
                            : "transparent",
                        borderColor:
                          key === questionData.correctAnswer
                            ? "#4caf50"
                            : "#e0e0e0",
                      }}
                    >
                      <Typography
                        fontWeight={
                          key === questionData.correctAnswer ? 600 : 400
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {key.toUpperCase()}. <MathRenderer content={value} />
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Right Column - Answer Summary & Notes */}
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
                  {t("practice.correctAnswerLabel")}
                </Typography>
                <Typography variant="h4" color="#1976d2" fontWeight={700}>
                  {questionData.correctAnswer}
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
                  {t("practice.yourAnswerLabel")}
                </Typography>
                <Typography
                  variant="h4"
                  color={questionData.isCorrect ? "#2e7d32" : "#d32f2f"}
                  fontWeight={700}
                >
                  {questionData.selectedAnswer || t("scoreDetails.notSelected")}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Notes Section */}
          <Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {!isEditing ? (
              <div className="p-4 mt-6 mb-6 border-l-4 border-blue-500 rounded-lg bg-blue-50">
                <h3 className="mb-2 text-lg font-semibold text-blue-800">
                  ✏️ {t("practice.notes")}:
                </h3>
                <div className="text-gray-700 text-[16px]">
                  {noteText || t("practice.noNotesYet")}
                </div>
              </div>
            ) : (
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder={t("practice.notePlaceholder")}
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
                gap: "20px",
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
                    value="reviewed"
                    control={
                      <Radio
                        disabled={isUpdatingStatus}
                        sx={{
                          color: "#4caf50",
                          "&.Mui-checked": { color: "#4caf50" },
                        }}
                      />
                    }
                    label={t("practice.reviewed")}
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
                    label={t("practice.needsReview")}
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
                    {t("practice.editNote")}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
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
                    {t("practice.saveNote")}
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
