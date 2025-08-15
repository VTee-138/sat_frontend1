import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Warning, Delete, Close } from "@mui/icons-material";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function VocabularyDialogs({
  folderDialog,
  vocabularyDialog,
  deleteDialog,
  onFolderDialogChange,
  onVocabularyDialogChange,
  onFolderSubmit,
  onVocabularySubmit,
  onCloseFolderDialog,
  onCloseVocabularyDialog,
  onConfirmDelete,
  onCloseDeleteDialog,
}) {
  const { t } = useLanguage();

  return (
    <>
      {/* Folder Dialog */}
      <Dialog open={folderDialog.open} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" component="div">
              {folderDialog.mode === "create"
                ? t("vocabulary.createFolderTitle")
                : t("vocabulary.editFolderTitle")}
            </Typography>
            <IconButton onClick={onCloseFolderDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label={t("vocabulary.folderName")}
            value={folderDialog.data.name}
            onChange={(e) =>
              onFolderDialogChange({
                ...folderDialog,
                data: { ...folderDialog.data, name: e.target.value },
              })
            }
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label={t("common.description")}
            multiline
            rows={3}
            value={folderDialog.data.description}
            onChange={(e) =>
              onFolderDialogChange({
                ...folderDialog,
                data: { ...folderDialog.data, description: e.target.value },
              })
            }
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label={t("common.color")}
            type="color"
            value={folderDialog.data.color}
            onChange={(e) =>
              onFolderDialogChange({
                ...folderDialog,
                data: { ...folderDialog.data, color: e.target.value },
              })
            }
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={onCloseFolderDialog} color="inherit">
            {t("common.cancel")}
          </Button>
          <Button
            onClick={onFolderSubmit}
            variant="contained"
            disabled={!folderDialog.data.name.trim()}
            sx={{ minWidth: 100 }}
          >
            {folderDialog.mode === "create"
              ? t("common.create")
              : t("common.update")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vocabulary Dialog */}
      <Dialog open={vocabularyDialog.open} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" component="div">
              {vocabularyDialog.mode === "create"
                ? t("vocabulary.addVocabularyTitle")
                : t("vocabulary.editVocabularyTitle")}
            </Typography>
            <IconButton onClick={onCloseVocabularyDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("vocabulary.word")}
                value={vocabularyDialog.data.word}
                onChange={(e) =>
                  onVocabularyDialogChange({
                    ...vocabularyDialog,
                    data: { ...vocabularyDialog.data, word: e.target.value },
                  })
                }
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("vocabulary.pronunciation")}
                value={vocabularyDialog.data.pronunciation}
                onChange={(e) =>
                  onVocabularyDialogChange({
                    ...vocabularyDialog,
                    data: {
                      ...vocabularyDialog.data,
                      pronunciation: e.target.value,
                    },
                  })
                }
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("vocabulary.meaning")}
                multiline
                rows={2}
                value={vocabularyDialog.data.meaning}
                onChange={(e) =>
                  onVocabularyDialogChange({
                    ...vocabularyDialog,
                    data: { ...vocabularyDialog.data, meaning: e.target.value },
                  })
                }
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("vocabulary.example")}
                multiline
                rows={2}
                value={vocabularyDialog.data.example}
                onChange={(e) =>
                  onVocabularyDialogChange({
                    ...vocabularyDialog,
                    data: { ...vocabularyDialog.data, example: e.target.value },
                  })
                }
                margin="normal"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={onCloseVocabularyDialog} color="inherit">
            {t("common.cancel")}
          </Button>
          <Button
            onClick={onVocabularySubmit}
            variant="contained"
            disabled={
              !vocabularyDialog.data.word.trim() ||
              !vocabularyDialog.data.meaning.trim()
            }
            sx={{ minWidth: 100 }}
          >
            {vocabularyDialog.mode === "create"
              ? t("common.add")
              : t("common.update")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        maxWidth="sm"
        fullWidth
        onClose={deleteDialog.loading ? undefined : onCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "error.main",
              }}
            >
              <Warning fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h6" component="div" color="error.main">
                {t("common.confirmDelete")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("common.actionCannotBeUndone")}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {deleteDialog.message}
          </Typography>
          {deleteDialog.type === "folder" && (
            <Box
              sx={{
                bgcolor: "warning.light",
                color: "warning.contrastText",
                p: 2,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "warning.main",
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                ⚠️ {t("vocabulary.deleteFolderMessage")}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
          <Button
            onClick={onCloseDeleteDialog}
            variant="outlined"
            color="inherit"
            disabled={deleteDialog.loading}
            sx={{ minWidth: 100 }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={onConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleteDialog.loading}
            startIcon={
              deleteDialog.loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Delete />
              )
            }
            sx={{ minWidth: 100 }}
          >
            {deleteDialog.loading ? t("common.deleting") : t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
