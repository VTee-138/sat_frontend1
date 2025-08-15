import React, { useState, useEffect } from "react";
import { Box, IconButton, useMediaQuery, Fade } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useLanguage } from "../../contexts/LanguageContext";
import Header from "../Header";
import FolderList from "./components/FolderList";
import VocabularyList from "./components/VocabularyList";
import VocabularyDialogs from "./components/VocabularyDialogs";
import FolderService from "../../services/FolderService";
import VocabularyService from "../../services/VocabularyService";
import { decryptData } from "../../common/decryption";

// LocalStorage key for selected folder
const SELECTED_FOLDER_KEY = "vocabulary_selected_folder";

export default function VocabularyManagerPage() {
  const { t } = useLanguage();
  const isMobile = useMediaQuery("(max-width: 768px)"); // Below 768px
  const [mobileOpen, setMobileOpen] = useState(false);

  const [folders, setFolders] = useState([]);
  const [vocabularies, setVocabularies] = useState([]);
  const [foldersLoading, setFoldersLoading] = useState(false);
  const [vocabulariesLoading, setVocabulariesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Dialog states
  const [folderDialog, setFolderDialog] = useState({
    open: false,
    mode: "create", // create, edit
    data: { name: "", description: "", color: "#3954d9" },
  });

  const [vocabularyDialog, setVocabularyDialog] = useState({
    open: false,
    mode: "create", // create, edit
    data: {
      word: "",
      meaning: "",
      context: "",
      pronunciation: "",
      example: "",
      difficulty: 3,
      tags: [],
    },
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: "", // folder, vocabulary
    id: "",
    message: "",
    loading: false,
    onConfirm: null,
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleFolderSelectMobile = (folderId) => {
    handleFolderSelect(folderId);
    if (isMobile) {
      setMobileOpen(false); // Close sidebar on mobile after selection
    }
  };

  // Close mobile sidebar when screen size changes to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  // Load saved folder selection from localStorage on mount
  useEffect(() => {
    const savedFolder = localStorage.getItem(SELECTED_FOLDER_KEY);
    if (savedFolder) {
      try {
        const parsedFolder = JSON.parse(savedFolder);
        setSelectedFolder(parsedFolder);
      } catch (error) {
        console.error("Error parsing saved folder:", error);
        localStorage.removeItem(SELECTED_FOLDER_KEY);
      }
    }
  }, []);

  useEffect(() => {
    loadFolders();
    // Don't load vocabularies here - let the selectedFolder useEffect handle it
  }, []);

  // Load vocabularies when selectedFolder changes (including from localStorage)
  useEffect(() => {
    if (folders.length > 0) {
      loadVocabularies(selectedFolder, searchTerm);
    }
  }, [selectedFolder, folders.length]);

  // Load folders
  const loadFolders = async () => {
    try {
      setFoldersLoading(true);
      const response = await FolderService.getFolders();
      const decryptedData = decryptData(response);
      setFolders(decryptedData.data || []);
    } catch (err) {
      toast.error(t("errors.networkError"));
    } finally {
      setFoldersLoading(false);
    }
  };

  // Load vocabularies
  const loadVocabularies = async (folderId = null, search = null) => {
    try {
      setVocabulariesLoading(true);
      const response = await VocabularyService.getVocabularies(
        1,
        50,
        folderId,
        search
      );
      const decryptedData = decryptData(response);
      setVocabularies(decryptedData.data || []);
    } catch (err) {
      toast.error(t("errors.networkError"));
    } finally {
      setVocabulariesLoading(false);
    }
  };

  // Handle folder operations
  const handleFolderSubmit = async () => {
    try {
      setFoldersLoading(true);
      if (folderDialog.mode === "create") {
        await FolderService.createFolder(folderDialog.data);
        toast.success(t("vocabulary.folderCreatedSuccess"));
      } else {
        await FolderService.updateFolder(
          folderDialog.data._id,
          folderDialog.data
        );
        toast.success(t("vocabulary.folderUpdatedSuccess"));
      }
      closeFolderDialog();
      await loadFolders();
    } catch (err) {
      toast.error(err.response?.data?.message || t("errors.serverError"));
    } finally {
      setFoldersLoading(false);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    const folder = folders.find((f) => f._id === folderId);
    const folderName = folder ? folder.name : "this folder";

    setDeleteDialog({
      open: true,
      type: "folder",
      id: folderId,
      message: `Are you sure you want to delete "${folderName}"?`,
      onConfirm: () => confirmDeleteFolder(folderId),
    });
  };

  const confirmDeleteFolder = async (folderId) => {
    try {
      setDeleteDialog((prev) => ({ ...prev, loading: true }));
      setFoldersLoading(true);
      await FolderService.deleteFolder(folderId);
      await loadFolders();
      if (selectedFolder === folderId) {
        setSelectedFolder(null);
        // Clear localStorage when selected folder is deleted
        localStorage.removeItem(SELECTED_FOLDER_KEY);
        loadVocabularies();
      }
      toast.success(t("vocabulary.folderDeletedSuccess"));
      setDeleteDialog({
        open: false,
        type: "",
        id: "",
        message: "",
        loading: false,
        onConfirm: null,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || t("errors.serverError"));
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
    } finally {
      setFoldersLoading(false);
    }
  };

  // Handle vocabulary operations
  const handleVocabularySubmit = async () => {
    try {
      setVocabulariesLoading(true);
      if (vocabularyDialog.mode === "create") {
        await VocabularyService.createVocabulary({
          ...vocabularyDialog.data,
          folderId: selectedFolder || folders[0]?._id,
        });
        toast.success(t("vocabulary.vocabularyAddedSuccess"));
      } else {
        await VocabularyService.updateVocabulary(
          vocabularyDialog.data._id,
          vocabularyDialog.data
        );
        toast.success(t("vocabulary.vocabularyUpdatedSuccess"));
      }
      closeVocabularyDialog();
      await loadVocabularies(selectedFolder, searchTerm);
    } catch (err) {
      toast.error(err.response?.data?.message || t("errors.serverError"));
    } finally {
      setVocabulariesLoading(false);
    }
  };

  const handleDeleteVocabulary = async (vocabularyId) => {
    const vocabulary = vocabularies.find((v) => v._id === vocabularyId);
    const vocabularyWord = vocabulary ? vocabulary.word : "this vocabulary";

    setDeleteDialog({
      open: true,
      type: "vocabulary",
      id: vocabularyId,
      message: `Are you sure you want to delete "${vocabularyWord}"?`,
      onConfirm: () => confirmDeleteVocabulary(vocabularyId),
    });
  };

  const confirmDeleteVocabulary = async (vocabularyId) => {
    try {
      setDeleteDialog((prev) => ({ ...prev, loading: true }));
      setVocabulariesLoading(true);
      await VocabularyService.deleteVocabulary(vocabularyId);
      await loadVocabularies(selectedFolder, searchTerm);
      toast.success(t("vocabulary.vocabularyDeletedSuccess"));
      setDeleteDialog({
        open: false,
        type: "",
        id: "",
        message: "",
        loading: false,
        onConfirm: null,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || t("errors.serverError"));
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
    } finally {
      setVocabulariesLoading(false);
    }
  };

  const handleSearch = () => {
    loadVocabularies(selectedFolder, searchTerm);
  };

  const handleFolderSelect = (folderId) => {
    setSelectedFolder(folderId);

    // Save selected folder to localStorage
    try {
      if (folderId === null) {
        localStorage.removeItem(SELECTED_FOLDER_KEY);
      } else {
        localStorage.setItem(SELECTED_FOLDER_KEY, JSON.stringify(folderId));
      }
    } catch (error) {
      console.error("Error saving folder to localStorage:", error);
    }

    // Only call vocabulary API, not folder API
    loadVocabularies(folderId, searchTerm);
  };

  // Dialog handlers
  const handleCreateFolder = () => {
    setFolderDialog({
      open: true,
      mode: "create",
      data: { name: "", description: "", color: "#3954d9" },
    });
  };

  const handleEditFolder = (folder) => {
    setFolderDialog({
      open: true,
      mode: "edit",
      data: folder,
    });
  };

  const handleCreateVocabulary = () => {
    setVocabularyDialog({
      open: true,
      mode: "create",
      data: {
        word: "",
        meaning: "",
        context: "",
        pronunciation: "",
        example: "",
        difficulty: 3,
        tags: [],
      },
    });
  };

  const handleEditVocabulary = (vocabulary) => {
    setVocabularyDialog({
      open: true,
      mode: "edit",
      data: vocabulary,
    });
  };

  const closeFolderDialog = () => {
    setFolderDialog({
      open: false,
      mode: "create",
      data: { name: "", description: "", color: "#3954d9" },
    });
  };

  const closeVocabularyDialog = () => {
    setVocabularyDialog({
      open: false,
      mode: "create",
      data: {
        word: "",
        meaning: "",
        context: "",
        pronunciation: "",
        example: "",
        difficulty: 3,
        tags: [],
      },
    });
  };

  const handleCloseDeleteDialog = () => {
    if (!deleteDialog.loading) {
      setDeleteDialog({
        open: false,
        type: "",
        id: "",
        message: "",
        loading: false,
        onConfirm: null,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.onConfirm) {
      deleteDialog.onConfirm();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          mt: "64px",
          position: "relative",
        }}
      >
        {/* Mobile Menu Button - Only show when sidebar is closed */}
        {isMobile && (
          <Fade in={!mobileOpen} timeout={300}>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                position: "absolute",
                top: 5,
                left: 16,
                zIndex: 1201,
                bgcolor: "#f9c571",
                color: "#fff",
                width: 48,
                height: 48,
                boxShadow: "0 4px 12px rgba(249, 197, 113, 0.4)",
                border: "2px solid #fff",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  bgcolor: "#f9c571",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Fade>
        )}

        {/* Backdrop for mobile sidebar */}
        {isMobile && mobileOpen && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0,0,0,0.5)",
              zIndex: 1250,
            }}
            onClick={handleDrawerToggle}
          />
        )}

        {/* Left Sidebar - Folders */}
        <FolderList
          folders={folders}
          loading={foldersLoading}
          selectedFolder={selectedFolder}
          vocabularies={vocabularies}
          onFolderSelect={handleFolderSelectMobile}
          onCreateFolder={handleCreateFolder}
          onEditFolder={handleEditFolder}
          onDeleteFolder={handleDeleteFolder}
          isMobile={isMobile}
          mobileOpen={mobileOpen}
          onClose={handleDrawerToggle}
        />

        {/* Right Content - Vocabularies */}
        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            ml: isMobile ? 0 : 0,
            width: isMobile ? "100%" : "calc(100% - 320px)",
          }}
        >
          <VocabularyList
            vocabularies={vocabularies}
            loading={vocabulariesLoading}
            selectedFolder={selectedFolder}
            folders={folders}
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
            onCreateVocabulary={handleCreateVocabulary}
            onEditVocabulary={handleEditVocabulary}
            onDeleteVocabulary={handleDeleteVocabulary}
            isMobile={isMobile}
          />
        </Box>
      </Box>

      {/* Dialogs */}
      <VocabularyDialogs
        folderDialog={folderDialog}
        vocabularyDialog={vocabularyDialog}
        deleteDialog={deleteDialog}
        onFolderDialogChange={setFolderDialog}
        onVocabularyDialogChange={setVocabularyDialog}
        onFolderSubmit={handleFolderSubmit}
        onVocabularySubmit={handleVocabularySubmit}
        onCloseFolderDialog={closeFolderDialog}
        onCloseVocabularyDialog={closeVocabularyDialog}
        onConfirmDelete={handleConfirmDelete}
        onCloseDeleteDialog={handleCloseDeleteDialog}
      />
    </Box>
  );
}
