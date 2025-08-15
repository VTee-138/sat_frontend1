import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  useMemo,
} from "react";
import Box from "@mui/material/Box";
import QuestionNavModal from "./components/QuestionNavModal";
import QuestionBox from "./components/QuestionBox";
import logo from "../../images/logo.png";
import { getExamByAssessmentId } from "../../services/ExamService";
import { postTest } from "../../services/TestService";
import { decryptData } from "../../common/decryption";
import MathRenderer from "../../common/MathRenderer";
import PassageHighlighter from "./components/PassageHighlighter";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UncompletedQuestionsModal from "./components/UncompletedQuestionsModal";
import ExamTransition from "./components/ExamTransition";
import {
  useParams,
  useNavigate,
  useLocation,
  UNSAFE_NavigationContext,
} from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import Loading from "../Loading";
import LeaveConfirmModal from "./components/LeaveConfirmModal";
import { clearExamLocalStorage } from "../../common/clearExamLocal";
import { toast } from "react-toastify";
import { Paper, IconButton, Tooltip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

// Generate random color array for color bar
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
const COLOR_BAR_SEGMENTS = 60;
function getRandomColorBar() {
  return Array.from({ length: COLOR_BAR_SEGMENTS }, getRandomColor);
}

export default function ExamPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [decryptedData, setDecryptedData] = useState(null);
  const [current, setCurrent] = useState(() => {
    const saved = localStorage.getItem("exam_current");
    return saved ? parseInt(saved) : 0;
  });
  const [examTime, setExamTime] = useState(0); // giây
  const [showModal, setShowModal] = useState(false);
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem("exam_answers");
    return saved ? JSON.parse(saved) : [];
  });
  const [marked, setMarked] = useState(() => {
    const saved = localStorage.getItem("exam_marked");
    return saved ? JSON.parse(saved) : [];
  });
  const timerRef = useRef();
  const [colorBarColors, setColorBarColors] = useState(() => {
    const saved = localStorage.getItem("exam_colorBarColors");
    return saved ? JSON.parse(saved) : getRandomColorBar();
  });
  const [highlighted, setHighlighted] = useState(() => {
    const saved = localStorage.getItem("highlighted_passage_" + current);
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [showUncompletedModal, setShowUncompletedModal] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentExamId, setCurrentExamId] = useState(null);
  const [currentSubject, setCurrentSubject] = useState(() => {
    const saved = localStorage.getItem("exam_currentSubject");
    return saved || "TIẾNG ANH";
  });

  const [currentModule, setCurrentModule] = useState(() => {
    const saved = localStorage.getItem("exam_currentModule");
    return saved || "MODULE 1";
  });
  const [currentExamTitle, setCurrentExamTitle] = useState(""); // Track current exam title
  const [showTransition, setShowTransition] = useState(false);
  const [nextExamInfo, setNextExamInfo] = useState(null);

  // Desmos Calculator state
  const [desmosOpen, setDesmosOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [desmosPosition, setDesmosPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const desmosRef = useRef(null);

  const navigate = useNavigate();
  const stablePassage = useMemo(() => {
    return (
      questions[current]?.contentQuestions || questions[current]?.passage || ""
    );
  }, [questions, current]);

  // ============ TIMER HELPER FUNCTIONS ============
  const getElapsedTimeFromStart = () => {
    const startTime = localStorage.getItem("exam_start_time");
    if (!startTime) return 0;
    const currentTime = Date.now();
    return Math.floor((currentTime - parseInt(startTime)) / 1000);
  };

  // const getElapsedTimeInMinutes = () => {
  //   return Math.floor(getElapsedTimeFromStart() / 60);
  // };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const calculateRemainingTime = useCallback(() => {
    const startTime = localStorage.getItem("exam_start_time");
    if (!startTime || !decryptedData) return 0;

    // Find current exam based on currentSubject and currentModule
    let currentExam = null;
    if (Array.isArray(decryptedData)) {
      currentExam = decryptedData.find(
        (exam) =>
          exam.subject === currentSubject && exam.module === currentModule
      );
    } else {
      currentExam = decryptedData;
    }

    const totalTime = currentExam?.time;
    if (!totalTime) return 0;

    const totalTimeInSeconds = totalTime * 60;
    const elapsedTimeInSeconds = getElapsedTimeFromStart();
    return Math.max(0, totalTimeInSeconds - elapsedTimeInSeconds);
  }, [decryptedData, currentSubject, currentModule]);

  const initializeExamTime = useCallback(() => {
    if (!decryptedData) {
      return;
    }

    // Find current exam based on currentSubject and currentModule
    let currentExam = null;
    if (Array.isArray(decryptedData)) {
      currentExam = decryptedData.find(
        (exam) =>
          exam.subject === currentSubject && exam.module === currentModule
      );
    } else {
      currentExam = decryptedData;
    }

    if (!currentExam?.time) {
      return;
    }

    const totalTime = currentExam.time;
    const totalTimeInSeconds = totalTime * 60;

    const startTime = localStorage.getItem("exam_start_time");
    const savedExamTime = localStorage.getItem("exam_examTime");

    if (startTime) {
      const remainingTime = calculateRemainingTime();
      setExamTime(remainingTime);
    } else if (savedExamTime) {
      setExamTime(parseInt(savedExamTime));
    } else {
      setExamTime(totalTimeInSeconds);
    }
  }, [decryptedData, currentSubject, currentModule, calculateRemainingTime]);

  // ============ EXAM SELECTION HELPER FUNCTIONS ============
  const findExamBySubjectAndModule = (subject, module) => {
    if (!Array.isArray(decryptedData)) {
      return null;
    }

    const foundExam = decryptedData.find(
      (exam) => exam.subject === subject && exam.module === module
    );

    return foundExam;
  };

  const getNextSubjectAndModule = useCallback(
    (currentSubject, currentModule, isDifficulty) => {
      if (currentSubject === "TIẾNG ANH") {
        if (currentModule === "MODULE 1") {
          // Sau TIẾNG ANH MODULE 1, chuyển sang MODULE 2 (dễ/khó)
          return {
            subject: "TIẾNG ANH",
            module: isDifficulty ? "MODULE 2-DIFFICULT" : "MODULE 2-EASY",
          };
        } else {
          // Sau TIẾNG ANH MODULE 2, chuyển sang TOÁN MODULE 1
          return {
            subject: "TOÁN",
            module: "MODULE 1",
          };
        }
      } else if (currentSubject === "TOÁN") {
        if (currentModule === "MODULE 1") {
          // Sau TOÁN MODULE 1, chuyển sang MODULE 2 (dễ/khó)
          return {
            subject: "TOÁN",
            module: isDifficulty ? "MODULE 2-DIFFICULT" : "MODULE 2-EASY",
          };
        } else {
          // Sau TOÁN MODULE 2, không còn đề nào nữa
          return null;
        }
      }
      return null;
    },
    []
  );

  // ============ LOCAL STORAGE HELPER FUNCTIONS ============
  const loadFromLocalStorage = () => {
    const savedCurrent = localStorage.getItem("exam_current");
    const savedAnswers = localStorage.getItem("exam_answers");
    const savedMarked = localStorage.getItem("exam_marked");
    const savedColorBarColors = localStorage.getItem("exam_colorBarColors");
    const savedCurrentSubject = localStorage.getItem("exam_currentSubject");
    const savedCurrentModule = localStorage.getItem("exam_currentModule");

    if (savedCurrent) setCurrent(parseInt(savedCurrent));
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedMarked) setMarked(JSON.parse(savedMarked));
    if (savedColorBarColors) setColorBarColors(JSON.parse(savedColorBarColors));
    if (savedCurrentSubject) setCurrentSubject(savedCurrentSubject);
    if (savedCurrentModule) setCurrentModule(savedCurrentModule);
  };

  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(
      key,
      typeof value === "object" ? JSON.stringify(value) : value.toString()
    );
  };

  // ============ EXAM DATA FUNCTIONS ============
  const fetchExamData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await getExamByAssessmentId(1, "", 6, id);
      const decrypted = decryptData(response.data);
      setDecryptedData(decrypted);

      // Find the current exam based on saved subject and module
      const currentExam = Array.isArray(decrypted)
        ? decrypted.find(
            (exam) =>
              exam.subject === currentSubject && exam.module === currentModule
          )
        : null;

      let examId = null;
      let questionsArr = [];

      if (currentExam) {
        questionsArr = currentExam.questions || [];
        examId = currentExam.examId || currentExam.id || currentExam._id;
        setCurrentExamTitle(currentExam.title?.text || "");

        // Set exam time for current exam if not already set by timer
        const startTime = localStorage.getItem("exam_start_time");
        if (!startTime) {
          // Only set initial time if no start time exists
          setExamTime((currentExam.time || 0) * 60);
        }
      } else if (Array.isArray(decrypted) && decrypted.length > 0) {
        // Fallback to first exam if current exam not found
        const fallbackExam =
          decrypted.find(
            (exam) => exam.subject === "TIẾNG ANH" && exam.module === "MODULE 1"
          ) || decrypted[0];

        questionsArr = fallbackExam.questions || [];
        examId = fallbackExam.examId || fallbackExam.id || fallbackExam._id;

        // Update current subject and module to match fallback
        setCurrentSubject(fallbackExam.subject || "TIẾNG ANH");
        setCurrentModule(fallbackExam.module || "MODULE 1");
        setCurrentExamTitle(fallbackExam.title?.text || "");

        // Set exam time for fallback exam if not already set by timer
        const startTime = localStorage.getItem("exam_start_time");
        if (!startTime) {
          // Only set initial time if no start time exists
          setExamTime((fallbackExam.time || 0) * 60);
        }
      } else if (decrypted?.questions) {
        questionsArr = decrypted.questions;
        examId = decrypted.examId || decrypted.id || decrypted._id;
      }

      setCurrentExamId(examId);
      setQuestions(questionsArr);
    } catch (error) {
      console.error("Failed to fetch exam questions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id, currentSubject, currentModule]);

  const initializeExamAnswers = useCallback(() => {
    if (questions.length > 0) {
      if (answers.length === 0) {
        setAnswers(Array(questions.length).fill(""));
      }
      if (marked.length === 0) {
        setMarked(Array(questions.length).fill(false));
      }
    }
  }, [questions.length, answers.length, marked.length]);

  // ============ NAVIGATION FUNCTIONS ============
  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setShowUncompletedModal(true);
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const handleSelect = (idx) => {
    setCurrent(idx);
    setShowModal(false);
  };

  // ============ ANSWER HANDLING FUNCTIONS ============
  const handleAnswer = (idx) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[current] = idx;
      return copy;
    });
  };

  const handleMark = (flag) => {
    setMarked((prev) => {
      const copy = [...prev];
      copy[current] = flag;
      return copy;
    });
  };

  const getUncompletedQuestions = () => {
    return answers.reduce((uncompleted, answer, index) => {
      if (answer === "" || answer === undefined || answer === null) {
        uncompleted.push(index);
      }
      return uncompleted;
    }, []);
  };

  // ============ EXAM FLOW FUNCTIONS ============
  const hasMoreExams = useCallback(() => {
    // Check if there are more exams based on subject/module flow
    if (currentSubject === "TIẾNG ANH") {
      if (currentModule === "MODULE 1") {
        // Sau TIẾNG ANH MODULE 1 luôn có MODULE 2
        return true;
      } else {
        // Sau TIẾNG ANH MODULE 2 sẽ sang TOÁN MODULE 1
        return true;
      }
    } else if (currentSubject === "TOÁN") {
      if (currentModule === "MODULE 1") {
        // Sau TOÁN MODULE 1 luôn có MODULE 2
        return true;
      } else {
        // Sau TOÁN MODULE 2 là hết
        return false;
      }
    }
    return false;
  }, [currentSubject, currentModule]);

  const prepareSubmissionData = useCallback(() => {
    const result = {};
    questions.forEach((q, idx) => {
      const key = q.question;
      if (q.type === "TLN") {
        const val = answers[idx];
        if (val !== undefined && val !== null && val !== "") {
          let num = "";
          if (val.startsWith(".")) {
            num = val;
          } else {
            num = Number(val);
          }
          result[key] = !isNaN(num) && val !== "" ? num : val;
        } else {
          result[key] = "";
        }
      } else {
        result[key] = answers[idx];
      }
    });
    return result;
  }, [questions, answers]);

  const handleNextExam = (isDifficulty = false) => {
    // Get next subject and module based on current state and difficulty
    const nextSubjectModule = getNextSubjectAndModule(
      currentSubject,
      currentModule,
      isDifficulty
    );

    if (!nextSubjectModule) {
      return false;
    }

    // Find the next exam
    const nextExam = findExamBySubjectAndModule(
      nextSubjectModule.subject,
      nextSubjectModule.module
    );

    if (!nextExam) {
      console.error("❌ Next exam not found:", nextSubjectModule);
      return false;
    }

    clearExamLocalStorage(true); // Preserve subject/module when transitioning

    // Reset start time for next exam
    const newStartTime = Date.now();
    localStorage.setItem("exam_start_time", newStartTime.toString());

    // Set exam ID for next exam
    const nextExamId = nextExam.examId || nextExam.id || nextExam._id;

    setCurrentExamId(nextExamId);
    setCurrentSubject(nextSubjectModule.subject);
    setCurrentModule(nextSubjectModule.module);
    setCurrentExamTitle(nextExam.title?.text || "");

    setQuestions(nextExam.questions || []);
    setAnswers(Array((nextExam.questions || []).length).fill(""));
    setMarked(Array((nextExam.questions || []).length).fill(false));
    setCurrent(0);
    setExamTime((nextExam.time || 0) * 60);
    setIsSubmitted(false);
    return true;
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return; // Prevent double submission

    try {
      setIsSubmitting(true);
      const result = prepareSubmissionData();

      // Calculate elapsed time for submission
      // const elapsedMinutes = getElapsedTimeInMinutes();

      const assessmentId = id; // id from params is the assessment ID

      // Validate exam ID before submission
      if (!currentExamId) {
        console.error("❌ No exam ID found, cannot submit");
        throw new Error("Không tìm thấy ID đề thi");
      }

      // Submit exam results
      const submitBody = {
        userAnswers: result,
        // userAnswers: {
        //   "Câu 1": "A",
        //   "Câu 2": 21,
        //   "Câu 3": 35,
        //   "Câu 4": "C",
        //   "Câu 5": "A",
        //   "Câu 6": "B",
        //   "Câu 7": "A",
        //   "Câu 8": 1,
        //   "Câu 9": "D",
        //   "Câu 10": "A",
        //   "Câu 11": "B",
        //   "Câu 12": "B",
        //   "Câu 13": "B",
        //   "Câu 14": "B",
        //   "Câu 15": "B",
        //   "Câu 16": "C",
        //   "Câu 17": "C",
        //   "Câu 18": "C",
        //   "Câu 19": "D",
        //   "Câu 20": 0.5,
        //   "Câu 21": "C",
        //   "Câu 22": "C",
        //   "Câu 23": "C",
        //   "Câu 24": "C",
        //   "Câu 25": "C",
        //   "Câu 26": "C",
        //   "Câu 27": "C",
        // },
        // examCompledTime: elapsedMinutes,
        // examId: currentExamId,
        assessmentId: assessmentId,
      };

      const response = await postTest(currentExamId, submitBody);

      // Handle multiple exams based on new logic
      if (hasMoreExams()) {
        // Extract isDifficulty from response data
        const isDifficulty = response?.isDifficulty || false;

        // Get next exam info for transition
        const nextSubjectModule = getNextSubjectAndModule(
          currentSubject,
          currentModule,
          isDifficulty
        );

        if (nextSubjectModule) {
          // Check if transitioning from English MODULE 2 to Math MODULE 1 - need break
          if (
            currentSubject === "TIẾNG ANH" &&
            (currentModule === "MODULE 2-EASY" ||
              currentModule === "MODULE 2-DIFFICULT") &&
            nextSubjectModule.subject === "TOÁN" &&
            nextSubjectModule.module === "MODULE 1"
          ) {
            // Clear exam data and navigate to break page
            clearExamLocalStorage();
            localStorage.removeItem("exam_start_time");
            setIsSubmitted(true);

            navigate(`/countdown-break/${assessmentId}`, {
              state: {
                fromSubject: "TIẾNG ANH",
                toSubject: "TOÁN",
              },
            });
            return;
          } else {
            // Show transition screen for other transitions (within same subject or Math modules)
            setNextExamInfo({
              currentSubject,
              currentModule,
              nextSubject: nextSubjectModule.subject,
              nextModule: nextSubjectModule.module,
              isDifficulty,
            });
            setShowTransition(true);
            return;
          }
        }
      }

      // Final submission - clear start time and mark as submitted
      localStorage.removeItem("exam_start_time");
      localStorage.removeItem("exam_assessment_id");
      setIsSubmitted(true);

      // Chuyển hướng sang trang hoàn thành nếu không còn bài thi tiếp theo
      navigate("/exam/completed?assessmentId=" + assessmentId);
    } catch (error) {
      console.error("❌ Error submitting exam:", error);
      toast.error(error?.response?.data?.message || "Failed to submit exam");
      setIsSubmitted(true);
      // TODO: Show error message to user
      // For now, still mark as submitted to prevent blocking
      // localStorage.removeItem("exam_start_time");
      // localStorage.removeItem("exam_assessment_id");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    prepareSubmissionData,
    id,
    currentExamId,
    hasMoreExams,
    currentSubject,
    currentModule,
    getNextSubjectAndModule,
    navigate,
  ]);

  const handleTransitionComplete = () => {
    if (nextExamInfo) {
      const success = handleNextExam(nextExamInfo.isDifficulty);

      // Always close transition screen, even if there's an error
      setShowTransition(false);
      setNextExamInfo(null);

      if (!success) {
        console.error("❌ Failed to load next exam");
        toast.error("Failed to load next exam");
      }
    }
  };

  // ============ MODAL HANDLING FUNCTIONS ============
  const handleConfirmSubmit = () => {
    setShowUncompletedModal(false);
    handleSubmit();
  };

  const handleCancelSubmit = () => {
    setShowUncompletedModal(false);
  };

  const handleConfirmLeave = () => {
    setShowLeaveModal(false);
    setIsSubmitted(true);
    clearExamLocalStorage();
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
    setPendingNavigation(null);
  };

  const handleRequestExit = useCallback(() => {
    if (isSubmitted) {
      navigate("/");
    } else {
      setShowLeaveModal(true);
      setPendingNavigation(() => () => {
        setIsSubmitted(true);
        navigate("/");
      });
    }
  }, [isSubmitted, navigate]);

  // ============ DESMOS CALCULATOR HANDLERS ============
  const handleDesmosToggle = () => {
    setDesmosOpen(!desmosOpen);
    // Reset position when opening
    if (!desmosOpen) {
      setDesmosPosition({ x: 100, y: 100 });
      setIsMaximized(false);
    }
  };

  const handleMaximizeToggle = () => {
    setIsMaximized(!isMaximized);
  };

  // Double click to reset position
  const handleDoubleClick = () => {
    setDesmosPosition({ x: 100, y: 100 });
  };

  // Drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = desmosRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    e.preventDefault();
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Constrain to viewport
        const maxX = window.innerWidth - 400; // Drawer width
        const maxY = window.innerHeight - 400; // Drawer height

        setDesmosPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ============ USEEFFECT HOOKS ============
  useEffect(() => {
    fetchExamData();
  }, [fetchExamData]);

  // Separate effect for handling location state to avoid affecting fetchExamData dependencies
  useEffect(() => {
    const state = location?.state;
    if (state?.continueToMath && state?.fromBreak) {
      // Set up for Math exam with proper module
      setCurrentSubject("TOÁN");
      setCurrentModule("MODULE 1"); // Always start with MODULE 1 for Math after break

      // Clear any location state to prevent re-triggering
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location?.state]);

  useEffect(() => {
    initializeExamAnswers();
  }, [initializeExamAnswers]);

  // Timer effect
  useEffect(() => {
    if (decryptedData) {
      timerRef.current = setInterval(() => {
        const startTime = localStorage.getItem("exam_start_time");

        if (startTime) {
          const remainingTime = calculateRemainingTime();

          setExamTime(remainingTime);

          // Set time expired flag when time runs out
          if (remainingTime <= 0) {
            setTimeExpired(true);
            clearInterval(timerRef.current);
          }
        } else {
          // Fallback to old countdown method if no start time
          setExamTime((t) => {
            const newTime = t - 1;
            if (newTime <= 0) {
              setTimeExpired(true);
              clearInterval(timerRef.current);
            }
            return Math.max(0, newTime);
          });
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [decryptedData, calculateRemainingTime]);

  // Handle time expiration
  useEffect(() => {
    if (timeExpired && !isSubmitted && !isSubmitting) {
      handleSubmit();
    }
  }, [timeExpired, isSubmitted, isSubmitting, handleSubmit]);

  // Khôi phục dữ liệu từ localStorage khi component mount (except examTime - handled in decryptedData effect)
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    saveToLocalStorage("exam_current", current.toString());
  }, [current]);

  useEffect(() => {
    saveToLocalStorage("exam_examTime", examTime.toString());
  }, [examTime]);

  useEffect(() => {
    saveToLocalStorage("exam_answers", answers);
  }, [answers]);

  useEffect(() => {
    saveToLocalStorage("exam_marked", marked);
  }, [marked]);

  useEffect(() => {
    saveToLocalStorage("exam_colorBarColors", colorBarColors);
  }, [colorBarColors]);

  useEffect(() => {
    saveToLocalStorage("exam_currentSubject", currentSubject);
  }, [currentSubject]);

  useEffect(() => {
    saveToLocalStorage("exam_currentModule", currentModule);
  }, [currentModule]);

  // Add global event listeners for Desmos drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    saveToLocalStorage("highlighted_passage_" + current, highlighted);
  }, [highlighted, current]);

  useEffect(() => {
    const saved = localStorage.getItem("highlighted_passage_" + current);
    setHighlighted(saved ? JSON.parse(saved) : []);
  }, [current]);

  useEffect(() => {
    initializeExamTime();
  }, [decryptedData, initializeExamTime]);

  // ============ NAVIGATION BLOCKER ============
  function useBlocker(when = true) {
    const { navigator } = useContext(UNSAFE_NavigationContext);
    useEffect(() => {
      if (!when) return;
      const push = navigator.push;
      navigator.push = (...args) => {
        if (!isSubmitted) {
          setShowLeaveModal(true);
          setPendingNavigation(() => () => push.apply(navigator, args));
        } else {
          push.apply(navigator, args);
        }
      };
      return () => {
        navigator.push = push;
      };
    }, [when, navigator]);
  }
  useBlocker(!isSubmitted);

  if (!id) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        {t("exam.examNotFound")}
      </div>
    );
  }

  return (
    <>
      {isLoading && <Loading />}

      {/* Exam Transition Screen */}
      {showTransition && nextExamInfo && (
        <ExamTransition
          assessmentId={id}
          currentSubject={nextExamInfo.currentSubject}
          currentModule={nextExamInfo.currentModule}
          nextSubject={nextExamInfo.nextSubject}
          nextModule={nextExamInfo.nextModule}
          onComplete={handleTransitionComplete}
        />
      )}

      <LeaveConfirmModal
        open={showLeaveModal}
        onCancel={handleCancelLeave}
        onConfirm={handleConfirmLeave}
      />

      {!showTransition && (
        <Box
          display="flex"
          flexDirection="column"
          height="100vh"
          position="relative"
        >
          {/* Header (fixed) */}
          <Header
            currentSubject={currentSubject}
            timeLeft={examTime}
            formatTime={formatTime}
            colorBarColors={colorBarColors}
            isSubmitted={isSubmitted}
            onRequestExit={handleRequestExit}
            examTitle={currentExamTitle}
            desmosOpen={desmosOpen}
            onDesmosToggle={handleDesmosToggle}
          />
          {/* Main content (scrollable, between header and footer) */}
          <Box
            display="flex"
            flex={1}
            sx={{
              pt: { xs: "80px", sm: "65px" },
              pb: { xs: "65px", sm: "74px" },
              height: "calc(100vh - 175.5px)",
              maxHeight: "calc(100vh - 37.5px)",
              flexDirection: { xs: "column", md: "row" },
              overflow: "hidden",
            }}
          >
            {/* Passage (left, scrollable) */}
            <Box
              width={{ xs: "100%", md: "50%" }}
              height={{ xs: "50%", md: "100%" }}
              p={{ xs: 2, sm: 3, md: 4 }}
              borderRight={{ xs: 0, md: 1 }}
              borderColor="#e0e0e0"
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              sx={{ overflowY: "auto", maxHeight: "100%" }}
            >
              {questions.length > 0 && questions[current] && (
                <Box>
                  <PassageHighlighter
                    passage={stablePassage}
                    passageKey={current}
                    subject={decryptedData?.subject}
                  />
                  {questions[current]?.imageUrl && (
                    <img
                      src={questions[current]?.imageUrl}
                      alt="logo"
                      style={{
                        objectFit: "cover",
                        margin: "10px auto 0",
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>
            {/* Question (right, scrollable) */}
            {questions.length > 0 && questions[current] ? (
              <Box
                width={{ xs: "100%", md: "50%" }}
                height={{ xs: "50%", md: "100%" }}
                p={{ xs: 2, sm: 3, md: 4 }}
                display="flex"
                flexDirection="column"
                sx={{ overflowY: "auto", maxHeight: "100%" }}
              >
                <QuestionBox
                  questionData={questions[current]}
                  current={current}
                  total={questions.length}
                  timer={formatTime(examTime)}
                  answer={answers[current]}
                  marked={marked[current]}
                  onAnswer={handleAnswer}
                  onMark={handleMark}
                  colorBarColors={colorBarColors}
                >
                  {/* Render answers using MathRenderer */}
                  {questions[current]?.contentAnswerA && (
                    <MathRenderer content={questions[current].contentAnswerA} />
                  )}
                  {questions[current]?.contentAnswerB && (
                    <MathRenderer content={questions[current].contentAnswerB} />
                  )}
                  {questions[current]?.contentAnswerC && (
                    <MathRenderer content={questions[current].contentAnswerC} />
                  )}
                  {questions[current]?.contentAnswerD && (
                    <MathRenderer content={questions[current].contentAnswerD} />
                  )}
                </QuestionBox>
              </Box>
            ) : null}
          </Box>
          {/* Footer (fixed) */}
          <Footer
            current={current}
            questions={questions}
            handleBack={handleBack}
            handleNext={handleNext}
            setShowModal={setShowModal}
            logo={logo}
            colorBarColors={colorBarColors}
            isSubmitting={isSubmitting}
          />
          <QuestionNavModal
            open={showModal}
            onClose={() => setShowModal(false)}
            questions={questions}
            current={current}
            marked={marked}
            answers={answers}
            handleSelect={handleSelect}
            examTitle={currentExamTitle}
          />
          <UncompletedQuestionsModal
            open={showUncompletedModal}
            onClose={handleCancelSubmit}
            onConfirm={handleConfirmSubmit}
            uncompletedQuestions={getUncompletedQuestions()}
            hasMoreExams={hasMoreExams()}
            isSubmitting={isSubmitting}
          />

          {/* Desmos Calculator Drawer */}
          {desmosOpen && (
            <Paper
              ref={desmosRef}
              sx={{
                position: "fixed",
                left: isMaximized ? 0 : desmosPosition.x,
                top: isMaximized ? 0 : desmosPosition.y,
                width: isMaximized
                  ? "100vw"
                  : { xs: "90vw", sm: "600px", md: "800px" },
                height: isMaximized
                  ? "100vh"
                  : { xs: "80vh", sm: "500px", md: "600px" },
                zIndex: isMaximized ? 9999 : 1500, // Higher than footer (100)
                display: "flex",
                flexDirection: "column",
                boxShadow: 4,
                borderRadius: isMaximized ? 0 : 2,
                overflow: "hidden",
                cursor: isDragging && !isMaximized ? "grabbing" : "default",
                transition: isDragging
                  ? "none"
                  : "left 0.2s ease, top 0.2s ease, width 0.2s ease, height 0.2s ease",
              }}
            >
              {/* Header with drag handle */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  borderBottom: 1,
                  borderColor: "divider",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  cursor: isDragging && !isMaximized ? "grabbing" : "grab",
                  userSelect: "none",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  "&:active": {
                    bgcolor: "primary.dark",
                  },
                }}
                onMouseDown={!isMaximized ? handleMouseDown : undefined}
                onDoubleClick={!isMaximized ? handleDoubleClick : undefined}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {!isMaximized && (
                    <Tooltip
                      title="Drag to move • Double click to reset position"
                      placement="bottom"
                    >
                      <DragHandleIcon sx={{ fontSize: 20 }} />
                    </Tooltip>
                  )}
                  <Typography variant="h6" fontWeight={600}>
                    Desmos Calculator
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Tooltip title={isMaximized ? "Restore" : "Maximize"}>
                    <IconButton
                      onClick={handleMaximizeToggle}
                      size="small"
                      sx={{ color: "inherit" }}
                    >
                      {isMaximized ? (
                        <CloseFullscreenIcon />
                      ) : (
                        <OpenInFullIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    onClick={handleDesmosToggle}
                    size="small"
                    sx={{ color: "inherit" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, height: "calc(100% - 64px)" }}>
                <iframe
                  src="https://www.desmos.com/calculator"
                  width="100%"
                  height="100%"
                  style={{
                    border: "none",
                    display: "block",
                  }}
                  title="Desmos Calculator"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            </Paper>
          )}
        </Box>
      )}
    </>
  );
}
