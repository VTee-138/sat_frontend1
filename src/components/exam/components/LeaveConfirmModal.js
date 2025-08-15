import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function LeaveConfirmModal({ open, onCancel, onConfirm }) {
  const { t } = useLanguage();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: { borderRadius: 3, minWidth: 340, textAlign: "center", p: 2 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          pt: 3,
        }}
      >
        <WarningAmberIcon color="warning" sx={{ fontSize: 48, mb: 1 }} />
        <span style={{ fontWeight: 700, fontSize: 20 }}>
          {t("exam.leaveExamTitle")}
        </span>
      </DialogTitle>
      <DialogContent sx={{ fontSize: 16, color: "#444", pb: 1 }}>
        {t("exam.leaveExamMessage")}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="primary"
          sx={{ minWidth: 100, fontWeight: 600 }}
        >
          {t("exam.stay")}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          sx={{ minWidth: 100, fontWeight: 600, ml: 2 }}
        >
          {t("exam.leave")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
