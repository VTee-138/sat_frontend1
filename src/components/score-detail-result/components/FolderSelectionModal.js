import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { FolderPlus, Delete as DeleteIcon } from "lucide-react";
import FolderIcon from "@mui/icons-material/Folder";
import { useLanguage } from "../../../contexts/LanguageContext";
import { toast } from "react-toastify";
import ErrorLogService from "../../../services/ErrorLogService";
import FolderQuestionService from "../../../services/FolderQuestionService";

export default function FolderSelectionModal({
  open,
  onClose,
  noteData,
  onSaveComplete,
  isCorrect,
}) {
  const { t } = useLanguage();
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    folderId: null,
    folderName: "",
  });

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const response = await FolderQuestionService.getFolderQuestions(1, 200);
      setFolders(response.data || []);
    } catch (err) {
      setError("Unable to fetch folders");
      toast.error("Unable to fetch folders");
    } finally {
      setLoading(false);
    }
  };

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      fetchFolders();
      setSelectedFolderId(null);
      setError("");
      setNewFolderName("");
      setShowNewFolderInput(false);
    }
  }, [open]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      setLoading(true);
      await FolderQuestionService.createFolderQuestion({
        name: newFolderName.trim(),
      });
      setNewFolderName("");
      setShowNewFolderInput(false);
      toast.success("Folder created successfully!");
      fetchFolders();
    } catch (err) {
      setError("Unable to create folder");
      toast.error(err.message || "Unable to create folder");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFolder = async () => {
    const folderIdToDelete = deleteConfirmDialog.folderId;
    if (!folderIdToDelete) return;
    try {
      setLoading(true);
      await FolderQuestionService.deleteFolderQuestion(folderIdToDelete);
      setFolders((prev) =>
        prev.filter((folder) => folder._id !== deleteConfirmDialog.folderId)
      );
      setDeleteConfirmDialog({ open: false, folderId: null, folderName: "" });

      // Reset selected folder if it was deleted
      if (selectedFolderId === deleteConfirmDialog.folderId) {
        setSelectedFolderId(null);
      }

      toast.success("Folder deleted successfully!");
      fetchFolders();
    } catch (err) {
      setError("Unable to delete folder");
      toast.error(err.message || "Unable to delete folder");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirm = (folderId, folderName) => {
    setDeleteConfirmDialog({
      open: true,
      folderId,
      folderName,
    });
  };

  const handleSaveToFolder = async () => {
    try {
      if (!selectedFolderId) {
        setError("Please select a folder");
        return;
      }

      setLoading(true);
      setError("");

      const data = {
        folderId: selectedFolderId,
        note: noteData.note,
        questionData: {
          examId: noteData.examId,
          questionNumber: noteData.questionNumber,
          module: noteData.module,
          section: noteData.section,
          correctAnswer: noteData.correctAnswer,
          yourAnswer: noteData.yourAnswer,
          question: noteData.question,
          isCorrect: isCorrect,
        },
      };
      await ErrorLogService.createErrorLog(data);

      onSaveComplete?.({
        folderId: selectedFolderId,
        folderName: folders.find((f) => f._id === selectedFolderId)?.name,
        noteData: noteData,
      });

      toast.success(t("vocabulary.noteSavedSuccess"));
      onClose();
    } catch (err) {
      setError(t("vocabulary.questionExistsInFolder"));
      // toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFolderId(null);
    setError("");
    setNewFolderName("");
    setShowNewFolderInput(false);
    setDeleteConfirmDialog({ open: false, folderId: null, folderName: "" });
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            {t("questionFolder.modalTitle")}
          </Typography>
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t("questionFolder.selectFolder")}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                {folders.map((folder) => {
                  const hasNotes = (folder.questionCount || 0) > 0;
                  const folderColor =
                    folder.color || (hasNotes ? "#ff9800" : "#9e9e9e");

                  return (
                    <Grid item xs={12} sm={6} md={6} key={folder._id}>
                      <Card
                        onClick={() =>
                          !loading &&
                          setSelectedFolderId(
                            selectedFolderId === folder._id ? null : folder._id
                          )
                        }
                        sx={{
                          cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.6 : 1,
                          border: `2px solid ${
                            selectedFolderId === folder._id
                              ? folderColor
                              : "#e0e0e0"
                          }`,
                          backgroundColor:
                            selectedFolderId === folder._id
                              ? `${folderColor}15`
                              : "#f8f9fa",
                          "&:hover": {
                            backgroundColor: `${folderColor}25`,
                            borderColor: folderColor,
                          },
                          borderRadius: 2,
                          position: "relative",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                          <Box display="flex" alignItems="center">
                            <FolderIcon
                              style={{
                                color: folderColor,
                                marginRight: 12,
                                fontSize: "2.5rem",
                              }}
                            />
                            <Box flexGrow={1}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {folder.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {folder.questionCount || 0}{" "}
                                {t("questionFolder.questions")}
                              </Typography>
                            </Box>
                            {selectedFolderId === folder._id && (
                              <Box
                                sx={{
                                  color: folderColor,
                                  fontWeight: "bold",
                                  fontSize: 18,
                                }}
                              >
                                ✓
                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              {showNewFolderInput ? (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={t("questionFolder.folderNamePlaceholder")}
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleCreateFolder();
                      }
                    }}
                    sx={{
                      mb: 1,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#3954d9",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3954d9",
                          borderWidth: "1px",
                          boxShadow: "none",
                        },
                      },
                    }}
                  />
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleCreateFolder}
                      disabled={!newFolderName.trim() || loading}
                      sx={{
                        bgcolor: "#3954d9",
                        "&:hover": { bgcolor: "#2843c7" },
                      }}
                    >
                      {t("common.create")}
                    </Button>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNewFolderInput(false);
                        setNewFolderName("");
                      }}
                      disabled={loading}
                    >
                      {t("common.cancel")}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box textAlign="center" mt={2}>
                  <Box display="flex" gap={1} justifyContent="center">
                    <Button
                      startIcon={<FolderPlus size={16} />}
                      onClick={() => setShowNewFolderInput(true)}
                      variant="outlined"
                      size="small"
                      disabled={loading}
                    >
                      {t("questionFolder.createFolder")}
                    </Button>
                    <Button
                      startIcon={<DeleteIcon size={16} />}
                      onClick={() => {
                        if (selectedFolderId) {
                          const selectedFolder = folders.find(
                            (f) => f._id === selectedFolderId
                          );
                          openDeleteConfirm(
                            selectedFolderId,
                            selectedFolder?.name || ""
                          );
                        }
                      }}
                      variant="outlined"
                      size="small"
                      color="error"
                      disabled={!selectedFolderId || loading}
                    >
                      {t("common.delete")}
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveToFolder}
            disabled={loading || !selectedFolderId}
            sx={{
              bgcolor: "#3954d9",
              "&:hover": { bgcolor: "#2843c7" },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                {t("common.save")}
              </Box>
            ) : (
              t("common.save")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete folder confirmation dialog */}
      <Dialog
        open={deleteConfirmDialog.open}
        onClose={() =>
          setDeleteConfirmDialog({
            open: false,
            folderId: null,
            folderName: "",
          })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            {t("questionFolder.deleteTitle")}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t("questionFolder.deleteMessage")}{" "}
            <strong>{deleteConfirmDialog.folderName}</strong>
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {t("common.actionCannotBeUndone")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteConfirmDialog({
                open: false,
                folderId: null,
                folderName: "",
              })
            }
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteFolder}
            disabled={loading}
          >
            {loading ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                {t("common.deleting")}
              </Box>
            ) : (
              t("common.delete")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
