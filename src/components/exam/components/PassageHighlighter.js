import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { MessageSquareDiff, FolderPlus } from "lucide-react";
import FolderIcon from "@mui/icons-material/Folder";
import { createPortal } from "react-dom";
// import FolderService from "../services/FolderService";
// import VocabularyService from "../services/VocabularyService";
// import { decryptData } from "../common/decryption";
import { toast } from "react-toastify";
import { useLanguage } from "../../../contexts/LanguageContext";
import FolderService from "../../../services/FolderService";
import { decryptData } from "../../../common/decryption";
import VocabularyService from "../../../services/VocabularyService";
import MathRenderer from "../../../common/MathRenderer";

export default function PassageHighlighter({
  passage,
  passageKey,
  subject,
  currentSubject,
  currentModule,
  examId,
}) {
  const { t } = useLanguage();

  // ✅ Create unique storage key based on subject, module, exam and question
  const createStorageKey = useCallback(
    (questionIndex) => {
      const subjectKey = currentSubject || subject || "UNKNOWN";
      const moduleKey = currentModule || "MODULE1";
      const examKey = examId || "default";
      return `highlighted_${subjectKey}_${moduleKey}_${examKey}_Q${questionIndex}`;
    },
    [currentSubject, subject, currentModule, examId]
  );

  const [highlighted, setHighlighted] = useState([]);

  // ✅ Load initial highlights when component mounts or keys change
  useEffect(() => {
    const storageKey = createStorageKey(passageKey);
    let saved = localStorage.getItem(storageKey);

    // ✅ Migration: Try old format if new format not found
    if (!saved) {
      const oldKey = "highlighted_passage_" + passageKey;
      const oldSaved = localStorage.getItem(oldKey);
      if (oldSaved) {
        console.log(
          "🔄 Migrating highlights from old format:",
          oldKey,
          "→",
          storageKey
        );
        saved = oldSaved;
        // Save to new format and remove old
        localStorage.setItem(storageKey, saved);
        localStorage.removeItem(oldKey);
      }
    }

    console.log("🔍 Loading highlights with key:", storageKey);
    console.log("📋 Storage key breakdown:", {
      subject: currentSubject || subject,
      module: currentModule,
      examId: examId,
      question: passageKey,
    });

    if (saved) {
      const parsed = JSON.parse(saved);
      console.log("✅ Found highlights:", parsed.length, "items");
      setHighlighted(
        parsed.map((item) => ({
          ...item,
          text: item.text ? item.text.trim() : "",
          isVocabulary: item.isVocabulary || item.note === "Vocabulary",
          note: item.note === "Vocabulary" ? null : item.note,
        }))
      );
    } else {
      console.log("🆕 No highlights found, starting fresh");
      setHighlighted([]);
    }
  }, [createStorageKey, passageKey]);

  const [notePopup, setNotePopup] = useState({
    open: false,
    anchor: null,
    text: "",
    range: null,
  });
  const [noteEditPopup, setNoteEditPopup] = useState({
    open: false,
    anchor: null,
  });
  const [noteInput, setNoteInput] = useState("");
  const passageRef = useRef();
  const popupRef = useRef();
  const noteEditRef = useRef();

  // State cho modal từ vựng
  const [folderModal, setFolderModal] = useState({
    open: false,
    selectedText: "",
    selectedRange: null,
    editIndex: undefined,
  });
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [vocabularyMeaning, setVocabularyMeaning] = useState("");
  const [vocabularyExample, setVocabularyExample] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    folderId: null,
    folderName: "",
  });

  // Save highlight/note to localStorage when changed
  useEffect(() => {
    const storageKey = createStorageKey(passageKey);
    localStorage.setItem(storageKey, JSON.stringify(highlighted));
    console.log(
      "💾 Saved highlights to:",
      storageKey,
      highlighted.length,
      "items"
    );
  }, [
    highlighted,
    passageKey,
    currentSubject,
    currentModule,
    examId,
    createStorageKey,
  ]);

  // Ẩn popup khi click ra ngoài
  useEffect(() => {
    if (!notePopup.open && !noteEditPopup.open) return;
    const handleClick = (e) => {
      const isInsideMainPopup =
        popupRef.current && popupRef.current.contains(e.target);
      const isInsideNoteEditPopup =
        noteEditRef.current && noteEditRef.current.contains(e.target);

      if (!isInsideMainPopup && !isInsideNoteEditPopup) {
        setNotePopup({ open: false, anchor: null, text: "", range: null });
        setNoteEditPopup({ open: false, anchor: null });
        setTempHighlight(null); // Clear temporary highlight when clicking outside
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notePopup.open, noteEditPopup.open]);

  // Handle click events cho highlight spans (tất cả môn học sử dụng MathRenderer)
  useEffect(() => {
    const handleHighlightClick = (e) => {
      if (e.target.classList.contains("highlight-span")) {
        e.stopPropagation();
        const highlightIndex = parseInt(
          e.target.getAttribute("data-highlight-index")
        );
        const h = highlighted[highlightIndex];

        if (h) {
          setNotePopup({
            open: true,
            anchor: { x: e.clientX, y: e.clientY },
            text: h.text,
            range: null,
            noteMode: false,
            editIndex: highlightIndex,
            editColor: h.color,
            editNote: h.note,
            isVocabulary: h.isVocabulary,
          });

          if (h.note) {
            setNoteEditPopup({
              open: true,
              anchor: { x: e.clientX, y: e.clientY }, // Sử dụng cùng vị trí để logic positioning tự tính toán
            });
            setNoteInput(h.note);
          } else {
            setNoteEditPopup({ open: false, anchor: null });
            setNoteInput("");
          }
        }
      }
    };

    if (passageRef.current) {
      passageRef.current.addEventListener("click", handleHighlightClick);
      const currentPassageRef = passageRef.current;
      return () => {
        if (currentPassageRef) {
          currentPassageRef.removeEventListener("click", handleHighlightClick);
        }
      };
    }
  }, [highlighted]);

  // State cho temporary highlight khi đang select
  const [tempHighlight, setTempHighlight] = useState(null);

  // Xử lý khi bôi đen text - Enhanced for cross-tag selection
  const handleMouseUp = (e) => {
    // Sử dụng setTimeout để đảm bảo event selection đã hoàn tất trước khi xử lý
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        return;
      }

      const range = selection.getRangeAt(0);
      if (
        !passageRef.current ||
        !passageRef.current.contains(range.commonAncestorContainer)
      ) {
        return;
      }

      // Không hiển thị popup nếu click vào highlight đã có
      if (e.target.closest(".highlight-span")) {
        return;
      }

      // ✅ Enhanced text extraction for cross-tag selection
      const selectedText = getSelectedTextFromRange(range);
      if (!selectedText || !selectedText.trim()) {
        return;
      }

      const rect = range.getBoundingClientRect();

      // ✅ Calculate position info để highlight chính xác
      const positionInfo = calculatePositionInfo(range);
      console.log("🎯 CALCULATED POSITION INFO:", positionInfo);

      // Lưu selection data và tạo temporary highlight
      setTempHighlight({
        text: selectedText.trim(),
        color: "#ffeb3b", // Màu vàng nhạt cho temp highlight
        isTemp: true,
        positionInfo, // Store position info
      });

      setNotePopup({
        open: true,
        anchor: {
          x: rect.left + rect.width / 2,
          y: rect.bottom + window.scrollY,
        },
        text: selectedText.trim(),
        range,
        positionInfo, // Store position info in popup
      });

      console.log("🔥 TEMP HIGHLIGHT CREATED:", {
        text: selectedText.trim(),
        positionInfo,
      });
    }, 0);
  };

  // ✅ Enhanced text extraction that works with cross-tag selections
  const getSelectedTextFromRange = (range) => {
    try {
      // Clone the range to avoid modifying the original
      const clonedRange = range.cloneRange();

      // Get the selected content
      const contents = clonedRange.cloneContents();

      // Create temporary element to extract text
      const tempDiv = document.createElement("div");
      tempDiv.appendChild(contents);

      // Extract clean text while preserving spaces between elements
      const text = tempDiv.textContent || tempDiv.innerText || "";

      // Clean up and normalize whitespace
      const cleanText = text.replace(/\s+/g, " ").trim();

      return cleanText;
    } catch (error) {
      console.error("Error extracting selected text:", error);
      // Fallback to simple toString method
      return window.getSelection().toString().trim();
    }
  };

  // ✅ Calculate position info để identify chính xác instance được highlight
  const calculatePositionInfo = (range) => {
    try {
      if (!passageRef.current || !range) return null;

      const passageElement = passageRef.current;
      const fullText =
        passageElement.textContent || passageElement.innerText || "";
      const selectedText = range.toString().trim();

      // Get text before selection để tính position
      const beforeRange = document.createRange();
      beforeRange.setStart(passageElement.firstChild || passageElement, 0);
      beforeRange.setEnd(range.startContainer, range.startOffset);
      const textBefore = beforeRange.toString();

      // Calculate position và context
      const startOffset = textBefore.length;
      const endOffset = startOffset + selectedText.length;

      // Get surrounding context (30 chars before/after)
      const contextBefore = textBefore.slice(-30);
      const contextAfter = fullText.slice(endOffset, endOffset + 30);

      return {
        startOffset,
        endOffset,
        contextBefore,
        contextAfter,
        selectedText,
      };
    } catch (error) {
      console.error("Error calculating position info:", error);
      return null;
    }
  };

  // Thêm highlight
  const handleHighlight = (color) => {
    if (!notePopup.range) return;

    // ✅ Use position info từ notePopup hoặc tempHighlight
    const positionInfo = notePopup.positionInfo || tempHighlight?.positionInfo;

    console.log("🎨 HANDLE HIGHLIGHT:", {
      text: notePopup.text.trim(),
      color,
      positionInfo,
      tempHighlight: tempHighlight?.positionInfo,
      notePopupInfo: notePopup.positionInfo,
    });

    setHighlighted((prev) => [
      ...prev,
      {
        text: notePopup.text.trim(),
        color,
        note: null,
        isVocabulary: false,
        positionInfo, // Store position info
      },
    ]);
    setNotePopup({ open: false, anchor: null, text: "", range: null });
    setNoteEditPopup({ open: false, anchor: null });
    setTempHighlight(null); // Clear temporary highlight
    window.getSelection().removeAllRanges();
  };
  // Thêm note
  const handleNote = () => {
    setNoteInput("");
    setNoteEditPopup({
      open: true,
      anchor: {
        x: notePopup.anchor.x,
        y: notePopup.anchor.y, // Sử dụng cùng anchor để logic positioning tự tính toán
      },
    });
    // Giữ temp highlight cho đến khi save note
  };

  // Xử lý click vào icon Aa (vocabulary) cho text mới
  const handleVocabulary = async () => {
    if (!notePopup.range || !notePopup.text) return;

    setFolderModal({
      open: true,
      selectedText: notePopup.text.trim(),
      selectedRange: notePopup.range,
      editIndex: undefined,
    });

    // Reset state
    setSelectedFolderId(null);
    setVocabularyMeaning("");
    setVocabularyExample("");
    setError("");

    // Load danh sách thư mục
    await loadFolders();

    // Đóng popup highlight
    setNotePopup({ open: false, anchor: null, text: "", range: null });
    setNoteEditPopup({ open: false, anchor: null });
    setTempHighlight(null); // Clear temporary highlight
    window.getSelection().removeAllRanges();
  };

  // Xử lý click vào icon Aa (vocabulary) cho highlighted text đã có
  const handleVocabularyFromExisting = async () => {
    if (!notePopup.text) return;

    setFolderModal({
      open: true,
      selectedText: notePopup.text.trim(),
      selectedRange: null, // Không có range vì đã highlight
      editIndex: notePopup.editIndex, // Lưu editIndex để cập nhật đúng highlight
    });

    // Reset state
    setSelectedFolderId(null);
    setVocabularyMeaning("");
    setVocabularyExample("");
    setError("");

    // Load danh sách thư mục
    await loadFolders();

    // Đóng popup highlight
    setNotePopup({ open: false, anchor: null, text: "", range: null });
    setNoteEditPopup({ open: false, anchor: null });
    setTempHighlight(null); // Clear temporary highlight for existing highlights
  };

  // Load danh sách thư mục
  const loadFolders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await FolderService.getFolders();
      const decryptedData = decryptData(response);
      setFolders(decryptedData.data || []);
    } catch (err) {
      setError("Unable to load folder list");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Tạo thư mục mới
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      setLoading(true);
      await FolderService.createFolder({
        name: newFolderName.trim(),
        color: "#9e9e9e",
      });
      setNewFolderName("");
      setShowNewFolderInput(false);
      await loadFolders();
      toast.success(t("vocabulary.folderCreatedSuccess"));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create folder");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa folder
  const handleDeleteFolder = async () => {
    try {
      setLoading(true);
      await FolderService.deleteFolder(deleteConfirmDialog.folderId);
      setDeleteConfirmDialog({ open: false, folderId: null, folderName: "" });
      await loadFolders();
      toast.success(t("vocabulary.folderDeletedSuccess"));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete folder");
    } finally {
      setLoading(false);
    }
  };

  // Mở dialog xác nhận xóa
  const openDeleteConfirm = (folderId, folderName) => {
    setDeleteConfirmDialog({
      open: true,
      folderId,
      folderName,
    });
  };

  // Lưu từ vựng vào thư mục
  const handleSaveVocabulary = async () => {
    try {
      // Validate
      if (!selectedFolderId) {
        setError("Please select a folder");
        return;
      }

      if (!vocabularyMeaning.trim()) {
        setError("Please enter word meaning");
        return;
      }

      setLoading(true);
      setError("");

      await VocabularyService.createVocabulary({
        word: folderModal.selectedText.trim(),
        meaning: vocabularyMeaning.trim(),
        example: vocabularyExample.trim(),
        context: passage.substring(0, 200) + "...", // Lấy context từ passage
        folderId: selectedFolderId,
      });

      // Đóng modal và reset state
      setFolderModal({
        open: false,
        selectedText: "",
        selectedRange: null,
        editIndex: undefined,
      });
      setSelectedFolderId(null);
      setVocabularyMeaning("");
      setVocabularyExample("");
      setError("");

      // Kiểm tra xem có phải từ text đã highlight hay text mới
      if (folderModal.selectedRange) {
        // Text mới - tạo highlight mới với position info
        const positionInfo =
          notePopup.positionInfo || tempHighlight?.positionInfo;
        setHighlighted((prev) => [
          ...prev,
          {
            text: folderModal.selectedText.trim(),
            color: "#e1f5fe",
            note: null,
            isVocabulary: true,
            positionInfo, // Store position info
          },
        ]);
      } else if (folderModal.editIndex !== undefined) {
        // Text đã highlight - cập nhật highlight hiện tại bằng editIndex
        setHighlighted((prev) =>
          prev.map((h, i) =>
            i === folderModal.editIndex ? { ...h, isVocabulary: true } : h
          )
        );
      }

      toast.success(t("vocabulary.vocabularyAddedSuccess"));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save vocabulary");
    } finally {
      setLoading(false);
    }
  };
  const handleSaveNote = () => {
    // ✅ Use position info từ notePopup hoặc tempHighlight
    const positionInfo = notePopup.positionInfo || tempHighlight?.positionInfo;

    setHighlighted((prev) => [
      ...prev,
      {
        text: notePopup.text.trim(),
        color: "#ffe082",
        note: noteInput.trim(),
        isVocabulary: false,
        positionInfo, // Store position info
      },
    ]);
    setNotePopup({
      open: false,
      anchor: null,
      text: "",
      range: null,
      noteMode: false,
    });
    setNoteEditPopup({ open: false, anchor: null });
    setNoteInput("");
    setTempHighlight(null); // Clear temporary highlight
    window.getSelection().removeAllRanges();
  };
  // Render passage với highlight - sử dụng MathRenderer cho tất cả môn học
  // const renderPassage = () => {
  //   // Sử dụng MathRenderer cho tất cả môn học để hiển thị đúng format
  //   return renderMathPassageWithHighlight();
  // };

  // // Render passage cho môn Toán với highlight
  // const renderMathPassageWithHighlight = () => {
  //   // Tạo custom MathRenderer với highlight support
  //   const CustomMathRenderer = ({ content, highlights, tempHighlight }) => {
  //     // Xử lý HTML content với highlight trước khi đưa vào MathRenderer
  //     let processedContent = content;

  //     // Combine permanent highlights và temporary highlight
  //     const allHighlights = [...highlights];
  //     if (tempHighlight) {
  //       allHighlights.push(tempHighlight);
  //     }

  //     // Sort highlights by text length (longest first) để tránh overlap
  //     const sortedHighlights = [...allHighlights].sort(
  //       (a, b) => b.text.trim().length - a.text.trim().length
  //     );

  //     // Apply highlights to content
  //     sortedHighlights.forEach((h, originalIndex) => {
  //       const highlightText = h.text.trim();
  //       // Escape special regex characters
  //       const escapedText = highlightText.replace(
  //         /[.*+?^${}()|[\]\\]/g,
  //         "\\$&"
  //       );

  //       // Tránh highlight text đã được highlight
  //       const regex = new RegExp(`(?!<[^>]*)(${escapedText})(?![^<]*>)`, "gi");

  //       // Style cho highlight - khác nhau giữa temp và permanent
  //       const highlightStyle = h.isTemp
  //         ? `
  //             background: ${h.color};
  //             border-radius: 3px;
  //             padding: 0 2px;
  //             cursor: pointer;
  //             border: 2px dashed #ff9800;
  //             animation: pulse-temp 1s ease-in-out infinite alternate;
  //           `
  //         : `
  //             background: ${h.color};
  //             border-radius: 3px;
  //             padding: 0 2px;
  //             cursor: pointer;
  //             ${h.note ? "border-bottom: 1px dashed #888;" : ""}
  //             ${h.isVocabulary ? "border-top: 2px solid #2196f3;" : ""}
  //           `;

  //       if (h.isTemp) {
  //         // Temporary highlight - không có data-highlight-index
  //         const replacement = `<span
  //               class="highlight-span temp-highlight"
  //               style="${highlightStyle}"
  //               title="Selected text - choose a color"
  //             >$1</span>`;
  //         processedContent = processedContent.replace(regex, replacement);
  //       } else {
  //         // Permanent highlight
  //         // Tìm originalIndex trong highlights array
  //         const realIndex = highlights.findIndex(
  //           (item) =>
  //             item.text === h.text &&
  //             item.color === h.color &&
  //             item.note === h.note &&
  //             item.isVocabulary === h.isVocabulary
  //         );

  //         const replacement = `<span
  //               class="highlight-span"
  //               data-highlight-index="${realIndex}"
  //               style="${highlightStyle}"
  //               title="${
  //                 h.isVocabulary && h.note
  //                   ? `Vocabulary | Note: ${h.note}`
  //                   : h.isVocabulary
  //                   ? "Vocabulary"
  //                   : h.note || ""
  //               }"
  //             >$1</span>`;

  //         processedContent = processedContent.replace(regex, replacement);
  //       }
  //     });

  //     return <MathRenderer content={processedContent} />;
  //   };

  //   return (
  //     <CustomMathRenderer
  //       content={passage}
  //       highlights={highlighted}
  //       tempHighlight={tempHighlight}
  //     />
  //   );
  // };

  // ✅ Smart highlight method với position-aware highlighting
  const processSmartHighlight = useCallback(
    (htmlContent, highlights, permanentHighlights) => {
      console.log(
        "🔥 PROCESSING SMART HIGHLIGHT:",
        highlights.length,
        "highlights"
      );

      // ✅ DOM-based highlighting thay vì regex replacement
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;

      // Sort highlights by position để apply từ cuối lên đầu (tránh offset shift)
      const sortedHighlights = [...highlights].sort((a, b) => {
        if (a.positionInfo?.startOffset && b.positionInfo?.startOffset) {
          return b.positionInfo.startOffset - a.positionInfo.startOffset; // Reverse order
        }
        return 0;
      });

      console.log(
        "📊 Sorted highlights:",
        sortedHighlights.map((h) => ({
          text: h.text,
          startOffset: h.positionInfo?.startOffset,
          isTemp: h.isTemp,
        }))
      );

      sortedHighlights.forEach((h, index) => {
        const highlightText = h.text.trim();
        if (!highlightText) return;

        console.log(`🖍️ Processing highlight ${index}:`, {
          text: highlightText,
          positionInfo: h.positionInfo,
          isTemp: h.isTemp,
        });

        // ✅ Use DOM manipulation để highlight chính xác
        const success = highlightInDOMAtPosition(
          tempDiv,
          h,
          permanentHighlights
        );
        console.log(`✅ Highlight ${index} success:`, success);
      });

      return tempDiv.innerHTML;
    },
    []
  ); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ Highlight text tại vị trí cụ thể trong DOM
  const highlightInDOMAtPosition = (
    container,
    highlight,
    permanentHighlights
  ) => {
    try {
      const highlightText = highlight.text.trim();
      let targetStartOffset = -1;
      let targetEndOffset = -1;

      // Get plain text để tính position
      const plainText = container.textContent || container.innerText || "";

      // ✅ Nếu có position info chính xác
      if (highlight.positionInfo?.startOffset !== undefined) {
        const { startOffset, endOffset, contextBefore, contextAfter } =
          highlight.positionInfo;

        // Verify text tại position có match không
        const textAtPosition = plainText.substring(
          startOffset,
          endOffset || startOffset + highlightText.length
        );

        console.log("🎯 Position verification:", {
          startOffset,
          endOffset,
          expected: highlightText,
          actual: textAtPosition,
          match: textAtPosition.toLowerCase() === highlightText.toLowerCase(),
        });

        if (textAtPosition.toLowerCase() === highlightText.toLowerCase()) {
          // Perfect match - use exact position
          targetStartOffset = startOffset;
          targetEndOffset = endOffset || startOffset + highlightText.length;
        } else {
          // Position không match, tìm bằng context
          console.log("⚠️ Position mismatch, using context matching");
          const contextResult = findBestMatchWithContext(
            plainText,
            highlightText,
            contextBefore,
            contextAfter
          );
          if (contextResult) {
            targetStartOffset = contextResult.startOffset;
            targetEndOffset = contextResult.endOffset;
          }
        }
      }

      // ✅ Fallback: first occurrence
      if (targetStartOffset === -1) {
        console.log("🔄 Using fallback - first occurrence");
        const foundIndex = plainText
          .toLowerCase()
          .indexOf(highlightText.toLowerCase());
        if (foundIndex !== -1) {
          targetStartOffset = foundIndex;
          targetEndOffset = foundIndex + highlightText.length;
        }
      }

      if (targetStartOffset === -1) {
        console.log("❌ No match found for:", highlightText);
        return false;
      }

      console.log("🎯 Final target position:", {
        targetStartOffset,
        targetEndOffset,
      });

      // ✅ Apply highlight using TreeWalker
      return applyHighlightAtOffset(
        container,
        targetStartOffset,
        targetEndOffset,
        highlight,
        permanentHighlights
      );
    } catch (error) {
      console.error("Error in highlightInDOMAtPosition:", error);
      return false;
    }
  };

  // ✅ Find best match using context
  const findBestMatchWithContext = (
    plainText,
    targetText,
    contextBefore,
    contextAfter
  ) => {
    const allMatches = [];
    let searchPos = 0;

    while (true) {
      const foundIndex = plainText
        .toLowerCase()
        .indexOf(targetText.toLowerCase(), searchPos);
      if (foundIndex === -1) break;

      const beforeText = plainText.substring(
        Math.max(0, foundIndex - 30),
        foundIndex
      );
      const afterText = plainText.substring(
        foundIndex + targetText.length,
        foundIndex + targetText.length + 30
      );

      let score = 0;
      if (contextBefore && beforeText.includes(contextBefore.slice(-15)))
        score += 2;
      if (contextAfter && afterText.includes(contextAfter.slice(0, 15)))
        score += 2;

      allMatches.push({
        startOffset: foundIndex,
        endOffset: foundIndex + targetText.length,
        score,
      });
      searchPos = foundIndex + 1;
    }

    if (allMatches.length === 0) return null;

    // Return best match
    return allMatches.reduce((best, current) =>
      current.score > best.score ? current : best
    );
  };

  // ✅ Apply highlight tại offset cụ thể trong DOM
  const applyHighlightAtOffset = (
    container,
    startOffset,
    endOffset,
    highlight,
    permanentHighlights
  ) => {
    try {
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function (node) {
            // Skip already highlighted text
            if (node.parentNode?.classList?.contains("highlight-span")) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        },
        false
      );

      // Build text node map
      const textNodes = [];
      let currentOffset = 0;
      let node;

      while ((node = walker.nextNode())) {
        const nodeText = node.textContent;
        textNodes.push({
          node: node,
          text: nodeText,
          startOffset: currentOffset,
          endOffset: currentOffset + nodeText.length,
        });
        currentOffset += nodeText.length;
      }

      // Find nodes containing target range
      let startNode = null;
      let endNode = null;
      let startNodeOffset = 0;
      let endNodeOffset = 0;

      for (const nodeInfo of textNodes) {
        // Find start node
        if (
          !startNode &&
          startOffset >= nodeInfo.startOffset &&
          startOffset < nodeInfo.endOffset
        ) {
          startNode = nodeInfo.node;
          startNodeOffset = startOffset - nodeInfo.startOffset;
        }

        // Find end node
        if (
          endOffset > nodeInfo.startOffset &&
          endOffset <= nodeInfo.endOffset
        ) {
          endNode = nodeInfo.node;
          endNodeOffset = endOffset - nodeInfo.startOffset;
          break;
        }
      }

      if (!startNode || !endNode) {
        console.log("❌ Could not find nodes for range");
        return false;
      }

      // Create highlight span
      const range = document.createRange();
      range.setStart(startNode, startNodeOffset);
      range.setEnd(endNode, endNodeOffset);

      const highlightSpan = document.createElement("span");
      highlightSpan.className = highlight.isTemp
        ? "highlight-span temp-highlight"
        : "highlight-span";

      const style = highlight.isTemp
        ? `background: ${highlight.color}; border-radius: 3px; cursor: pointer; animation: pulse-temp 1s ease-in-out infinite alternate;`
        : `background: ${
            highlight.color
          }; border-radius: 3px; cursor: pointer; ${
            highlight.note ? "border-bottom: 1px dashed #888;" : ""
          } ${highlight.isVocabulary ? "border-top: 2px solid #2196f3;" : ""}`;

      highlightSpan.style.cssText = style;

      if (highlight.isTemp) {
        highlightSpan.title = "Selected text - choose a color";
      } else {
        const dataIndex = permanentHighlights.findIndex(
          (item) =>
            item.text === highlight.text &&
            item.color === highlight.color &&
            item.note === highlight.note &&
            item.isVocabulary === highlight.isVocabulary
        );
        highlightSpan.setAttribute("data-highlight-index", dataIndex);
        highlightSpan.title =
          highlight.isVocabulary && highlight.note
            ? `Vocabulary | Note: ${highlight.note}`
            : highlight.isVocabulary
            ? "Vocabulary"
            : highlight.note || "";
      }

      // Extract and wrap content
      const extractedContent = range.extractContents();
      highlightSpan.appendChild(extractedContent);
      range.insertNode(highlightSpan);

      console.log("✅ Successfully applied highlight at offset:", {
        startOffset,
        endOffset,
      });
      return true;
    } catch (error) {
      console.error("Error applying highlight at offset:", error);
      return false;
    }
  };

  // ✅ Advanced highlight processing - supports cross-tag highlighting
  const highlightedPassage = useMemo(() => {
    const allHighlights = [...highlighted];
    if (tempHighlight) {
      allHighlights.push(tempHighlight);
    }

    if (allHighlights.length === 0) {
      return passage;
    }

    // Sort highlights by text length (longest first) to avoid conflicts
    const sortedHighlights = [...allHighlights].sort(
      (a, b) => b.text.trim().length - a.text.trim().length
    );

    return processSmartHighlight(passage, sortedHighlights, highlighted);
  }, [passage, highlighted, tempHighlight, processSmartHighlight]);

  // ✅ Simple fallback highlighting for edge cases

  // Thêm logic đổi màu/sửa/xóa note
  const handleEditHighlight = (color) => {
    if (notePopup.editIndex === undefined) return;
    setHighlighted((prev) =>
      prev.map((h, i) => (i === notePopup.editIndex ? { ...h, color } : h))
    );
    setNotePopup({ open: false, anchor: null, text: "", range: null });
    setNoteEditPopup({ open: false, anchor: null });
  };
  const handleEditNote = () => {
    setNoteInput(notePopup.editNote || "");
    setNoteEditPopup({
      open: true,
      anchor: {
        x: notePopup.anchor.x,
        y: notePopup.anchor.y, // Sử dụng cùng anchor để logic positioning tự tính toán
      },
    });
  };
  const handleSaveEditNote = () => {
    setHighlighted((prev) =>
      prev.map((h, i) =>
        i === notePopup.editIndex ? { ...h, note: noteInput.trim() } : h
      )
    );
    setNotePopup({
      open: false,
      anchor: null,
      text: "",
      range: null,
      noteMode: false,
    });
    setNoteEditPopup({ open: false, anchor: null });
    setNoteInput("");
  };
  const handleDeleteHighlight = () => {
    if (notePopup.editIndex === undefined) return;
    setHighlighted((prev) => {
      const idx = notePopup.editIndex;
      return prev.filter((_, i) => i !== idx);
    });
    setNotePopup({ open: false, anchor: null, text: "", range: null });
    setNoteEditPopup({ open: false, anchor: null });
  };
  // Thêm hàm xóa note riêng (giữ vocabulary nếu có)
  const handleDeleteNote = () => {
    if (notePopup.editIndex === undefined) return;
    setHighlighted((prev) =>
      prev.map((h, i) => (i === notePopup.editIndex ? { ...h, note: null } : h))
    );
    setNotePopup({ open: false, anchor: null, text: "", range: null });
    setNoteEditPopup({ open: false, anchor: null });
  };
  // --- Portal popup position update logic ---
  const [popupPos, setPopupPos] = useState({
    left: 0,
    top: 0,
    transform: "translate(-50%, -100%)",
  });
  const [noteEditPos, setNoteEditPos] = useState({
    left: 0,
    top: 0,
    transform: "translate(-50%, 0)",
  });
  useEffect(() => {
    if (!notePopup.open) return;
    const updatePos = () => {
      if (!notePopup.anchor) return;
      const noteMode = !!notePopup.noteMode;
      const popupWidth = noteMode ? 300 : 240;
      const popupHeight = noteMode ? 160 : 60;
      const GAP = 2; // Giảm khoảng cách xuống 2px để gần hơn

      // Sử dụng anchor position trực tiếp thay vì range rect để tránh vấn đề với MathRenderer
      let left = notePopup.anchor.x;
      let top = notePopup.anchor.y;
      let transform = "translate(-50%, 0)";

      // Nếu popup vượt xuống dưới màn hình thì hiển thị phía trên
      if (top + popupHeight > window.innerHeight + window.scrollY - 8) {
        top = notePopup.anchor.y - popupHeight - GAP;
        transform = "translate(-50%, 0)";
      }
      // Nếu vượt phải
      if (left + popupWidth / 2 > window.innerWidth - 8) {
        left = window.innerWidth - popupWidth / 2 - 8;
      }
      // Nếu vượt trái
      if (left - popupWidth / 2 < 8) {
        left = popupWidth / 2 + 8;
      }
      setPopupPos({ left, top, transform });
    };
    updatePos();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [notePopup]);

  // Position logic cho note edit popup
  useEffect(() => {
    if (!noteEditPopup.open) return;

    const updateNoteEditPos = () => {
      if (!noteEditPopup.anchor) return;

      const popupWidth = 350;
      const popupHeight = 160;
      const mainPopupHeight = 60; // Chiều cao của popup chính
      const GAP = 8; // Khoảng cách giữa popup chính và note popup

      let left = noteEditPopup.anchor.x + window.scrollX;
      let top = noteEditPopup.anchor.y + window.scrollY + mainPopupHeight + GAP; // Hiển thị dưới popup chính với khoảng cách hợp lý
      let transform = "translate(-50%, 0)";

      // Nếu vượt phải
      if (left + popupWidth / 2 > window.innerWidth - 8) {
        left = window.innerWidth - popupWidth / 2 - 8;
      }
      // Nếu vượt trái
      if (left - popupWidth / 2 < 8) {
        left = popupWidth / 2 + 8;
      }

      // Nếu vượt xuống dưới màn hình, hiển thị phía trên popup chính
      if (top + popupHeight > window.innerHeight + window.scrollY - 8) {
        top = noteEditPopup.anchor.y + window.scrollY - popupHeight - GAP;
        transform = "translate(-50%, 0)";
      }

      setNoteEditPos({ left, top, transform });
    };

    updateNoteEditPos();
    window.addEventListener("scroll", updateNoteEditPos, true);
    window.addEventListener("resize", updateNoteEditPos);
    return () => {
      window.removeEventListener("scroll", updateNoteEditPos, true);
      window.removeEventListener("resize", updateNoteEditPos);
    };
  }, [noteEditPopup]);
  return (
    <>
      {/* CSS cho highlight spans trong MathRenderer */}
      <style>
        {`
           .highlight-span {
             cursor: pointer !important;
             transition: all 0.2s ease;
           }
           .highlight-span:hover {
             opacity: 0.8 !important;
             transform: scale(1.02);
           }
           .math-renderer .highlight-span {
             display: inline !important;
           }
           .temp-highlight {
             position: relative;
           }
           @keyframes pulse-temp {
             0% { 
               opacity: 0.7; 
               box-shadow: 0 0 5px rgba(255, 152, 0, 0.5);
             }
             100% { 
               opacity: 1; 
               box-shadow: 0 0 10px rgba(255, 152, 0, 0.8);
             }
           }
           
           /* Đảm bảo selection vẫn hiển thị rõ */
           ::selection {
             background: #3178c6 !important;
             color: white !important;
           }
           ::-moz-selection {
             background: #3178c6 !important;
             color: white !important;
           }
         `}
      </style>
      <Box
        maxWidth={600}
        fontSize={{ xs: 16, sm: 18 }}
        lineHeight={1.7}
        ref={passageRef}
        onMouseUp={handleMouseUp}
        onPointerUp={handleMouseUp} // Thêm để hỗ trợ touch devices
        style={{ userSelect: "text", position: "relative" }}
      >
        <MathRenderer content={highlightedPassage} />
      </Box>
      {/* Popup chọn màu/note/xóa luôn hiện với mọi đoạn highlight */}
      {notePopup.open &&
        !notePopup.noteMode &&
        createPortal(
          <Box
            ref={popupRef}
            position="absolute"
            left={popupPos.left}
            top={popupPos.top}
            zIndex={2000}
            bgcolor="#fff"
            boxShadow={3}
            p={1}
            display="flex"
            gap={1}
            style={{ transform: popupPos.transform }}
            sx={{
              borderRadius: "24px",
            }}
          >
            {/* Vocabulary Indicator */}
            {/* {notePopup.isVocabulary && (
              <Box
                sx={{
                  position: "absolute",
                  top: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#2196f3",
                  color: "white",
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                📚 Vocabulary
              </Box>
            )} */}

            <Box
              onClick={() =>
                notePopup.editIndex !== undefined
                  ? handleEditHighlight("#ffe082")
                  : handleHighlight("#ffe082")
              }
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#ffe082",
                borderRadius: "50%",
                border: "2px solid #ccc",
                cursor: "pointer",
              }}
            />
            <Box
              onClick={() =>
                notePopup.editIndex !== undefined
                  ? handleEditHighlight("#b2f2e6")
                  : handleHighlight("#b2f2e6")
              }
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#b2f2e6",
                borderRadius: "50%",
                border: "2px solid #ccc",
                cursor: "pointer",
              }}
            />
            <Box
              onClick={() =>
                notePopup.editIndex !== undefined
                  ? handleEditHighlight("#ffd6e0")
                  : handleHighlight("#ffd6e0")
              }
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#ffd6e0",
                borderRadius: "50%",
                border: "2px solid #ccc",
                cursor: "pointer",
              }}
            />
            <IconButton
              size="small"
              sx={{
                p: 0.5,
                borderRadius: "50%",
                border: "2px solid #ccc",
                width: 36,
                height: 36,
                fontSize: 14,
                fontWeight: 600,
                color: "#666",
              }}
              onClick={
                notePopup.editIndex !== undefined
                  ? handleVocabularyFromExisting
                  : handleVocabulary
              }
              title="Add to Vocabulary"
            >
              Aa
            </IconButton>
            <IconButton
              size="small"
              sx={{
                p: 0.5,
                borderRadius: "50%",
                border: "2px solid #ccc",
                width: 36,
                height: 36,
              }}
              onClick={
                notePopup.editIndex !== undefined ? handleEditNote : handleNote
              }
              title="Add/Edit note"
            >
              <MessageSquareDiff fontSize="small" />
            </IconButton>
            {notePopup.editIndex !== undefined && (
              <IconButton
                color="error"
                size="small"
                onClick={handleDeleteHighlight}
                sx={{
                  p: 0.5,
                  borderRadius: "50%",
                  border: "2px solid #ccc",
                  width: 36,
                  height: 36,
                }}
                title="Delete highlight"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
            {/* Nếu là note, thêm nút xóa note */}
            {/* {notePopup.editIndex !== undefined && notePopup.editNote && (
              <IconButton
                color="warning"
                size="small"
                onClick={handleDeleteNote}
                sx={{ p: 0.5 }}
                title="Delete note"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )} */}
          </Box>,
          document.body
        )}
      {/* Popup edit note riêng */}
      {noteEditPopup.open &&
        createPortal(
          <Box
            ref={noteEditRef}
            position="absolute"
            left={noteEditPos.left}
            top={noteEditPos.top}
            zIndex={2001}
            bgcolor="#fff"
            borderRadius={3}
            boxShadow={6}
            p="10px"
            width={350}
            style={{ transform: noteEditPos.transform }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Vocabulary Indicator trong note popup */}
            {/* {notePopup.isVocabulary && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                  p: 1,
                  backgroundColor: "#e3f2fd",
                  borderRadius: "8px",
                  border: "1px solid #2196f3",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#1976d2", fontWeight: 600 }}
                >
                  📚 Saved as Vocabulary
                </Typography>
              </Box>
            )} */}

            <Box mb={"10px"} fontSize={17} fontWeight={700} color="#3954d9">
              {notePopup.editIndex !== undefined ? "Edit note:" : "Add a note:"}
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={"10px"}>
              <input
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "2px solid #bfc8f7",
                  borderRadius: 6,
                  fontSize: 16,
                  outline: "none",
                  transition: "border 0.2s",
                  color: "#222",
                }}
                placeholder="Enter meaning..."
                onFocus={(e) => (e.target.style.border = "2px solid #3954d9")}
                onBlur={(e) => (e.target.style.border = "2px solid #bfc8f7")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && noteInput.trim()) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (notePopup.editIndex !== undefined) {
                      handleSaveEditNote();
                    } else {
                      handleSaveNote();
                    }
                  }
                }}
              />
              {notePopup.editIndex !== undefined && notePopup.editNote && (
                <IconButton
                  color="error"
                  size="small"
                  onClick={handleDeleteNote}
                  sx={{ p: 0.5, "&:hover": { bgcolor: "#f5f5f5" } }}
                  title="Delete note"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#3954d9",
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                px: "16px",
                py: "8px",
                borderRadius: "16px",
                boxShadow: 0,
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:disabled": { bgcolor: "#bfc8f7" },
                "&:hover": { bgcolor: "#2843c7" },
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!noteInput.trim()) return;
                if (notePopup.editIndex !== undefined) {
                  handleSaveEditNote();
                } else {
                  handleSaveNote();
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
              disabled={!noteInput.trim()}
            >
              Save
            </Button>
          </Box>,
          document.body
        )}

      {/* Vocabulary folder selection modal */}
      <Dialog
        open={folderModal.open}
        onClose={() =>
          setFolderModal({
            open: false,
            selectedText: "",
            selectedRange: null,
            editIndex: undefined,
          })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Save Vocabulary: <strong>"{folderModal.selectedText}"</strong>
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
              {/* Word meaning input */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                  Word Meaning:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Enter word meaning..."
                  value={vocabularyMeaning}
                  onChange={(e) => setVocabularyMeaning(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
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
              </Box>

              {/* Example input */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                  Example (optional):
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Enter example sentence..."
                  value={vocabularyExample}
                  onChange={(e) => setVocabularyExample(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
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
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select folder to save this vocabulary:
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                {folders.map((folder) => {
                  // Use same color logic as FolderList.js
                  const hasVocabulary = (folder.vocabularyCount || 0) > 0;
                  const folderColor =
                    folder.color || (hasVocabulary ? "#ff9800" : "#9e9e9e");

                  return (
                    <Grid item xs={12} sm={6} key={folder._id}>
                      <Card
                        onClick={() => setSelectedFolderId(folder._id)}
                        sx={{
                          cursor: "pointer",
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
                              className="text-[40px]"
                              style={{
                                color: folderColor,
                                marginRight: 12,
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
                                {folder.vocabularyCount || 0} words
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
                    placeholder="New folder name"
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
                    >
                      Create
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        setShowNewFolderInput(false);
                        setNewFolderName("");
                      }}
                    >
                      Cancel
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
                    >
                      Create New Folder
                    </Button>
                    <Button
                      startIcon={<DeleteIcon fontSize="small" />}
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
                      disabled={!selectedFolderId}
                    >
                      Delete Selected
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setFolderModal({
                open: false,
                selectedText: "",
                selectedRange: null,
                editIndex: undefined,
              });
              setSelectedFolderId(null);
              setVocabularyMeaning("");
              setVocabularyExample("");
              setError("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveVocabulary}
            disabled={loading || !selectedFolderId || !vocabularyMeaning.trim()}
            sx={{
              bgcolor: "#3954d9",
              "&:hover": { bgcolor: "#2843c7" },
            }}
          >
            {loading ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                Saving...
              </Box>
            ) : (
              "Save Vocabulary"
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
            Confirm Delete Folder
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the folder "
            <strong>{deleteConfirmDialog.folderName}</strong>"?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            This action will also delete all vocabularies in this folder and
            cannot be undone.
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
            Cancel
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
                Deleting...
              </Box>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
