import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  useMemo,
} from "react";
import Box from "@mui/material/Box";
import QuestionNavModal from "../exam/components/QuestionNavModal";
import QuestionBox from "../exam/components/QuestionBox";
import logo from "../../images/logo.png";
import { getAllQuestionsByType } from "../../services/QuestionBankService";
import MathRenderer from "../../common/MathRenderer";
import PassageHighlighter from "../exam/components/PassageHighlighter";
import Header from "../exam/components/Header";
import Footer from "../exam/components/Footer";
import UncompletedQuestionsModal from "../exam/components/UncompletedQuestionsModal";
import {
  useNavigate,
  useSearchParams,
  UNSAFE_NavigationContext,
} from "react-router-dom";

import Loading from "../Loading";
import LeaveConfirmModal from "../exam/components/LeaveConfirmModal";
import { toast } from "react-toastify";
import { Paper, IconButton, Tooltip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { submitPractice } from "../../services/PracticeResultService";

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

export default function PracticeExam() {
  const [searchParams] = useSearchParams();
  const subject = searchParams.get("subject");
  const questionType = searchParams.get("questionType");
  const parentCategory = searchParams.get("parentCategory");

  const [questions, setQuestions] = useState([]);
  const [practiceData, setPracticeData] = useState(null);
  const [current, setCurrent] = useState(() => {
    const saved = localStorage.getItem("exam_current");
    return saved ? parseInt(saved) : 0;
  });
  const [showModal, setShowModal] = useState(false);
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem("exam_answers");
    return saved ? JSON.parse(saved) : [];
  });
  const [marked, setMarked] = useState(() => {
    const saved = localStorage.getItem("exam_marked");
    return saved ? JSON.parse(saved) : [];
  });
  const [colorBarColors] = useState(() => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [practiceTitle, setPracticeTitle] = useState("");

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
      questions[current]?.contentQuestion || questions[current]?.passage || ""
    );
  }, [questions, current]);

  // ============ TIMER HELPER FUNCTIONS ============
  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // ============ LOCAL STORAGE HELPER FUNCTIONS ============
  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(
      key,
      typeof value === "object" ? JSON.stringify(value) : value.toString()
    );
  };

  const clearPracticeLocalStorage = () => {
    localStorage.removeItem("exam_current");
    localStorage.removeItem("exam_answers");
    localStorage.removeItem("exam_marked");
    localStorage.removeItem("exam_colorBarColors");
    localStorage.removeItem("exam_start_time");
    // Clear custom exam data
    localStorage.removeItem("customExamData");
    // Clear highlighted passages
    for (let i = 0; i < questions.length; i++) {
      localStorage.removeItem("highlighted_passage_" + i);
    }
  };

  // ============ PRACTICE DATA FUNCTIONS ============
  const fetchPracticeData = useCallback(async () => {
    // Check if we have custom exam data first
    const customExamDataString = localStorage.getItem("customExamData");

    if (customExamDataString) {
      // Use custom exam data
      setIsLoading(true);
      try {
        const customExamData = JSON.parse(customExamDataString);

        const practiceData = {
          title: customExamData.title || {
            text: "Custom Test",
            code: "",
          },
          numberOfQuestions: customExamData.numberOfQuestions || 0,
          time: customExamData.time || 45, // Use provided time or default 45 minutes
          questions: customExamData.questions || [],
          subject: customExamData.subject || "ENGLISH",
        };

        setPracticeData(practiceData);
        setPracticeTitle(practiceData.title.text);
        setQuestions(practiceData.questions || []);

        // Initialize start time
        const startTime = Date.now();
        localStorage.setItem("exam_start_time", startTime.toString());
      } catch (error) {
        console.error("Failed to parse custom exam data:", error);
        toast.error("Failed to load custom test data");
        // Clear invalid custom exam data
        localStorage.removeItem("customExamData");
        navigate("/practice/question-bank");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Original logic for regular practice
    if (!subject) {
      toast.error("Missing subject parameter");
      return;
    }

    setIsLoading(true);
    try {
      let response;
      let title = "";

      if (parentCategory) {
        // Practice all questions in a parent category
        response = await getAllQuestionsByType({
          subject: subject,
          questionType: parentCategory,
        });
        title = `${subject} - ${parentCategory}`;
      } else if (questionType) {
        // Practice specific question type
        response = await getAllQuestionsByType({
          subject: subject,
          questionType: questionType,
        });
        title = `${subject} - ${questionType}`;
      } else {
        navigate("/practice/question-bank");
        return;
      }

      // Use data similar to data-exam-new.json format
      const practiceData = {
        title: {
          text: title,
          code: "",
        },
        numberOfQuestions: response?.data?.numberOfQuestions || 0,
        time: 45, // 45 minutes for practice
        questions: response?.data?.questions || [],
        subject: subject,
      };

      setPracticeData(practiceData);
      setPracticeTitle(title);
      setQuestions(practiceData.questions || []);
      // setExamTime(practiceData.time * 60); // Convert to seconds

      // Initialize start time
      const startTime = Date.now();
      localStorage.setItem("exam_start_time", startTime.toString());
    } catch (error) {
      console.error("Failed to fetch practice questions:", error);
      toast.error("Failed to load practice questions");
    } finally {
      setIsLoading(false);
    }
  }, [subject, questionType, parentCategory, navigate]);

  const initializePracticeAnswers = useCallback(() => {
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

  // ============ SUBMISSION FUNCTIONS ============
  const prepareSubmissionData = () => {
    const result = {};
    questions.forEach((q, idx) => {
      const key = q._id;
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
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return; // Prevent double submission

    try {
      setIsSubmitting(true);
      const result = prepareSubmissionData();

      const response = await submitPractice(result);

      clearPracticeLocalStorage();
      setIsSubmitted(true);

      // Navigate to result page with response data
      navigate("/practice/submit-result", { state: response });
    } catch (error) {
      console.error("❌ Error submitting practice:", error);
      toast.error("Failed to submit practice");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    navigate,
    clearPracticeLocalStorage,
    prepareSubmissionData,
  ]);

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
    clearPracticeLocalStorage();
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
      // Clear custom exam data when exiting
      localStorage.removeItem("customExamData");
      navigate("/practice/question-bank");
    } else {
      setShowLeaveModal(true);
      setPendingNavigation(() => () => {
        setIsSubmitted(true);
        // Clear custom exam data when exiting
        localStorage.removeItem("customExamData");
        navigate("/practice/question-bank");
      });
    }
  }, [isSubmitted, navigate]);

  // ============ DESMOS CALCULATOR HANDLERS ============
  const handleDesmosToggle = () => {
    setDesmosOpen(!desmosOpen);
    if (!desmosOpen) {
      setDesmosPosition({ x: 100, y: 100 });
      setIsMaximized(false);
    }
  };

  const handleMaximizeToggle = () => {
    setIsMaximized(!isMaximized);
  };

  const handleDoubleClick = () => {
    setDesmosPosition({ x: 100, y: 100 });
  };

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

        const maxX = window.innerWidth - 400;
        const maxY = window.innerHeight - 400;

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
    fetchPracticeData();
  }, [fetchPracticeData]);

  useEffect(() => {
    initializePracticeAnswers();
  }, [initializePracticeAnswers]);

  // Save to localStorage
  useEffect(() => {
    saveToLocalStorage("exam_current", current.toString());
  }, [current]);

  useEffect(() => {
    saveToLocalStorage("exam_answers", answers);
  }, [answers]);

  useEffect(() => {
    saveToLocalStorage("exam_marked", marked);
  }, [marked]);

  useEffect(() => {
    saveToLocalStorage("exam_colorBarColors", colorBarColors);
  }, [colorBarColors]);

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

  useEffect(() => {
    // Check if we have custom exam data
    const customExamDataString = localStorage.getItem("customExamData");

    if (!customExamDataString && !subject) {
      // No custom data and no subject parameter, redirect
      navigate("/practice/question-bank");
    }
  }, [subject, navigate]);

  return (
    <>
      {isLoading && <Loading />}

      <LeaveConfirmModal
        open={showLeaveModal}
        onCancel={handleCancelLeave}
        onConfirm={handleConfirmLeave}
      />

      <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        position="relative"
      >
        {/* Header (fixed) */}
        <Header
          currentSubject={
            practiceData?.subject === "MATH" ? "TOÁN" : "TIẾNG ANH"
          }
          formatTime={formatTime}
          colorBarColors={colorBarColors}
          isSubmitted={isSubmitted}
          onRequestExit={handleRequestExit}
          examTitle={practiceTitle}
          desmosOpen={desmosOpen}
          onDesmosToggle={handleDesmosToggle}
          isTimeLeft={false}
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
                  subject={practiceData?.subject}
                />
                {questions[current]?.imageUrl && (
                  <img
                    src={questions[current]?.imageUrl}
                    alt="question"
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
                answer={answers[current]}
                marked={marked[current]}
                onAnswer={handleAnswer}
                onMark={handleMark}
                colorBarColors={colorBarColors}
              >
                {/* Render answers using MathRenderer */}
                {questions[current]?.contentAnswer?.contentAnswerA && (
                  <MathRenderer
                    content={questions[current].contentAnswer.contentAnswerA}
                  />
                )}
                {questions[current]?.contentAnswer?.contentAnswerB && (
                  <MathRenderer
                    content={questions[current].contentAnswer.contentAnswerB}
                  />
                )}
                {questions[current]?.contentAnswer?.contentAnswerC && (
                  <MathRenderer
                    content={questions[current].contentAnswer.contentAnswerC}
                  />
                )}
                {questions[current]?.contentAnswer?.contentAnswerD && (
                  <MathRenderer
                    content={questions[current].contentAnswer.contentAnswerD}
                  />
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
          examTitle={practiceTitle}
        />

        <UncompletedQuestionsModal
          open={showUncompletedModal}
          onClose={handleCancelSubmit}
          onConfirm={handleConfirmSubmit}
          uncompletedQuestions={getUncompletedQuestions()}
          hasMoreExams={false} // No more exams in practice mode
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
              zIndex: isMaximized ? 9999 : 1500,
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
                    {isMaximized ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
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
    </>
  );
}
