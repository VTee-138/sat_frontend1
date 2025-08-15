import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Warning, QuestionMark } from "@mui/icons-material";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function UncompletedQuestionsModal({
  open,
  onClose,
  onConfirm,
  uncompletedQuestions,
  hasMoreExams = false,
  isSubmitting = false,
}) {
  const { t } = useLanguage();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pb: 2,
        }}
      >
        <Warning color="warning" />
        <Typography variant="h6" component="div">
          {hasMoreExams ? t("exam.completeExam") : t("exam.submitExamConfirm")}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {uncompletedQuestions.length > 0 ? (
          <>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {t("exam.stillHaveUnansweredQuestions").replace(
                "{count}",
                uncompletedQuestions.length
              )}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                my: 2,
                p: 2,
                backgroundColor: "#fafafa",
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              {uncompletedQuestions.map((questionIndex) => (
                <Chip
                  key={questionIndex}
                  icon={<QuestionMark />}
                  label={t("exam.questionNumber").replace(
                    "{number}",
                    questionIndex + 1
                  )}
                  variant="outlined"
                  color="warning"
                  size="small"
                />
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />
          </>
        ) : (
          <Typography variant="body1" color="success.main" gutterBottom>
            {t("exam.answeredAllQuestions")}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary">
          {hasMoreExams
            ? t("exam.continueToNextExam")
            : t("exam.confirmSubmitMessage")}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          disabled={isSubmitting}
        >
          {t("common.cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={hasMoreExams ? "primary" : "warning"}
          autoFocus
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isSubmitting
            ? t("common.loading")
            : hasMoreExams
            ? t("exam.continueNextExam")
            : t("exam.submitFinalAnswer")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
