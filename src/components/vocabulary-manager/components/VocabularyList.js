import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { Add, Search, MenuBook, CheckCircle } from "@mui/icons-material";
import VocabularyService from "../../../services/VocabularyService";
import VocabularyCard from "./VocabularyCard";
import { useLanguage } from "../../../contexts/LanguageContext";
import { toast } from "react-toastify";

export default function VocabularyList({
  vocabularies,
  loading,
  selectedFolder,
  folders,
  searchTerm,
  onSearchChange,
  onSearch,
  onCreateVocabulary,
  onEditVocabulary,
  onDeleteVocabulary,
  isMobile,
}) {
  const { t } = useLanguage();
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [localVocabularies, setLocalVocabularies] = useState(vocabularies);
  const [hiddenMeanings, setHiddenMeanings] = useState(new Set());
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    vocabularyId: null,
    vocabularyWord: "",
  });

  // Update local state when vocabularies prop changes
  useEffect(() => {
    setLocalVocabularies(vocabularies);
    // Initialize all meanings as hidden by default
    const allVocabIds = new Set(vocabularies.map((vocab) => vocab._id));
    setHiddenMeanings(allVocabIds);
  }, [vocabularies]);

  const filteredVocabularies = selectedFolder
    ? localVocabularies.filter((v) => v.folderId?._id === selectedFolder)
    : localVocabularies;

  const handleStatusChange = async (vocabularyId, newStatus) => {
    // If changing to "learned", show confirmation dialog
    if (newStatus === "learned") {
      const vocabulary = localVocabularies.find((v) => v._id === vocabularyId);
      setConfirmDialog({
        open: true,
        vocabularyId,
        vocabularyWord: vocabulary?.word || "",
      });
      return;
    }

    // For other statuses, update immediately
    await updateVocabularyStatus(vocabularyId, newStatus);
  };

  const updateVocabularyStatus = async (vocabularyId, newStatus) => {
    // Optimistic update - change UI immediately
    const previousVocabularies = [...localVocabularies];
    setLocalVocabularies((prev) =>
      prev.map((vocab) =>
        vocab._id === vocabularyId ? { ...vocab, status: newStatus } : vocab
      )
    );

    setUpdatingStatus((prev) => ({ ...prev, [vocabularyId]: true }));

    try {
      await VocabularyService.updateVocabularyStatus(vocabularyId, newStatus);
      if (newStatus === "learned") {
        toast.success(t("vocabulary.congratulationsMessage"));
      }
    } catch (error) {
      toast.error(t("vocabulary.statusUpdateFailed"));

      // Rollback - revert local state if API fails
      setLocalVocabularies(previousVocabularies);
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [vocabularyId]: false }));
    }
  };

  const handleConfirmLearned = () => {
    updateVocabularyStatus(confirmDialog.vocabularyId, "learned");
    setConfirmDialog({ open: false, vocabularyId: null, vocabularyWord: "" });
  };

  const handleCancelLearned = () => {
    setConfirmDialog({ open: false, vocabularyId: null, vocabularyWord: "" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "learned":
        return "#4caf50"; // Green
      case "needs_review":
        return "#ff9800"; // Orange
      case "not_learned":
      default:
        return "#f44336"; // Red
    }
  };

  const toggleMeaningVisibility = (vocabularyId) => {
    setHiddenMeanings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(vocabularyId)) {
        newSet.delete(vocabularyId);
      } else {
        newSet.add(vocabularyId);
      }
      return newSet;
    });
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: isMobile ? "50px 24px 13px" : "14px 24px 13px",
          borderBottom: "1px solid #e0e0e0",
          bgcolor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={"12px"}
        >
          <Box>
            <Typography variant="h5" fontWeight="600" color="text.primary">
              {selectedFolder
                ? folders.find((f) => f._id === selectedFolder)?.name ||
                  t("vocabulary.title")
                : t("vocabulary.allVocabularies")}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {filteredVocabularies.length} {t("vocabulary.wordsFound")}
            </Typography>
          </Box>
          {selectedFolder !== null && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onCreateVocabulary}
              disabled={!selectedFolder && folders.length === 0}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              {t("vocabulary.addWord")}
            </Button>
          )}
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder={t("vocabulary.searchVocabularies")}
            value={searchTerm}
            onChange={onSearchChange}
            onKeyPress={(e) => e.key === "Enter" && onSearch()}
            sx={{
              flexGrow: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#f5f5f5",
              },
            }}
          />
          <Button
            variant="outlined"
            onClick={onSearch}
            sx={{
              borderRadius: 2,
              px: 3,
              minWidth: "auto",
            }}
          >
            <Search />
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          overflowY: "auto",
          p: 3,
          height: 0, // Force flex child to respect parent height
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ height: "50%" }}
          >
            <CircularProgress size={48} />
          </Box>
        ) : filteredVocabularies.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ height: "50%", color: "text.secondary" }}
          >
            <MenuBook sx={{ fontSize: 64, mb: 2, opacity: 0.6 }} />
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
              {selectedFolder
                ? t("vocabulary.noVocabulariesInFolder")
                : t("vocabulary.noVocabulariesYet")}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", maxWidth: 400 }}
            >
              {selectedFolder
                ? t("vocabulary.startBuildingVocabulary")
                : t("vocabulary.createFolderAndAddWords")}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredVocabularies.map((vocabulary) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={vocabulary._id}>
                <VocabularyCard
                  vocabulary={vocabulary}
                  updatingStatus={updatingStatus}
                  selectedFolder={selectedFolder}
                  hiddenMeanings={hiddenMeanings}
                  onEditVocabulary={onEditVocabulary}
                  onDeleteVocabulary={onDeleteVocabulary}
                  handleStatusChange={handleStatusChange}
                  toggleMeaningVisibility={toggleMeaningVisibility}
                  getStatusColor={getStatusColor}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Confirmation Dialog for Learned Status */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCancelLearned}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            color: "primary.main",
            fontWeight: 600,
            pb: 1,
          }}
        >
          <CheckCircle
            sx={{
              fontSize: 48,
              color: "#4caf50",
              mb: 1,
              display: "block",
              mx: "auto",
            }}
          />
          {t("vocabulary.markAsLearnedTitle")}
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 2 }}>
          <DialogContentText
            sx={{
              fontSize: "16px",
              color: "text.primary",
              mb: 2,
            }}
          >
            {t("vocabulary.markAsLearnedMessage")}{" "}
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                fontSize: "18px",
              }}
            >
              "{confirmDialog.vocabularyWord}"
            </Typography>
            ?
          </DialogContentText>
          <DialogContentText
            sx={{
              fontSize: "14px",
              color: "text.secondary",
              fontStyle: "italic",
            }}
          >
            {t("vocabulary.markAsLearnedNote")}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
          <Button
            onClick={handleCancelLearned}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              color: "text.secondary",
              borderColor: "grey.300",
              "&:hover": {
                borderColor: "grey.400",
                bgcolor: "grey.50",
              },
            }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirmLearned}
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              bgcolor: "#4caf50",
              "&:hover": {
                bgcolor: "#45a049",
              },
            }}
          >
            {t("vocabulary.yesIveLearnedIt")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
