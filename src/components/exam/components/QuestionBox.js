import { Box, Stack, Collapse } from "@mui/material";
import React, { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MathRenderer from "../../../common/MathRenderer";
import { useLanguage } from "../../../contexts/LanguageContext";

export const isNumeric = (numericValue) => {
  if (numericValue === 0 || numericValue === "0") return true;
  if (!numericValue) return false;
  if (typeof numericValue === "string" && numericValue.includes(",")) {
    numericValue = numericValue.replace(",", ".");
  }
  if (numericValue.endsWith(".")) return false;
  return !isNaN(numericValue) && !isNaN(parseFloat(numericValue));
};

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
const COLOR_BAR_SEGMENTS_QB = 30;
function getRandomColorBarQB() {
  return Array.from({ length: COLOR_BAR_SEGMENTS_QB }, getRandomColor);
}

export default function QuestionBox({
  questionData,
  current,
  total,
  timer,
  answer,
  marked,
  onAnswer,
  onMark,
}) {
  const { t } = useLanguage();
  const letters = ["A", "B", "C", "D"];
  const colorBarColorsQB = React.useMemo(() => getRandomColorBarQB(), []);
  const [showReject, setShowReject] = useState(() => {
    const saved = localStorage.getItem("show_reject_option");
    return saved ? JSON.parse(saved) : false;
  });
  const [rejectedOptions, setRejectedOptions] = useState(() => {
    const saved = localStorage.getItem(`rejected_options_${current}`);
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    const saved = localStorage.getItem(`rejected_options_${current}`);
    setRejectedOptions(saved ? JSON.parse(saved) : []);
  }, [current]);
  useEffect(() => {
    localStorage.setItem(
      `rejected_options_${current}`,
      JSON.stringify(rejectedOptions)
    );
  }, [rejectedOptions, current]);
  useEffect(() => {
    localStorage.setItem("show_reject_option", JSON.stringify(showReject));
  }, [showReject]);
  useEffect(() => {
    if (answer !== null && rejectedOptions.includes(answer)) {
      onAnswer(null);
    }
  }, [rejectedOptions]);

  const handleToggleReject = (idx) => {
    setRejectedOptions((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };
  const handleToggleShowReject = () => setShowReject((prev) => !prev);

  // Build options from contentAnswerA-D for data-exam-detail.json format
  const options = [
    questionData?.contentAnswerA || questionData?.contentAnswer?.contentAnswerA,
    questionData?.contentAnswerB || questionData?.contentAnswer?.contentAnswerB,
    questionData?.contentAnswerC || questionData?.contentAnswer?.contentAnswerC,
    questionData?.contentAnswerD || questionData?.contentAnswer?.contentAnswerD,
  ].filter(Boolean);

  return (
    <Box className="flex flex-col ">
      {/* Header: Question number, Mark for Review, Timer, Progress bar */}
      <Box className="mb-4">
        <Box className="flex items-center mb-2">
          <Box
            className="flex items-center justify-center w-8 h-8 text-lg font-bold border-2 border-black "
            sx={{
              backgroundColor: "black",
              color: "white",
            }}
          >
            {current + 1}
          </Box>
          <Stack
            sx={{
              backgroundColor: "#f0f0f0",
              height: "32px",
              width: "100%",
              pr: "10px ",
            }}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" gap={"10px"}>
              <button
                className="flex items-center justify-center w-6 h-6 ml-1 focus:outline-none"
                onClick={() => onMark(!marked)}
                aria-label="Mark for Review"
              >
                {marked ? (
                  // Bookmark filled (red)
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#C80019"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 4C5.44772 4 5 4.44772 5 5V21.382C5 21.9366 5.63316 22.2532 6.08579 21.8944L12 17.118L17.9142 21.8944C18.3668 22.2532 19 21.9366 19 21.382V5C19 4.44772 18.5523 4 18 4H6Z"
                      fill="#C80019"
                    />
                  </svg>
                ) : (
                  // Bookmark outline (black)
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 4C5.44772 4 5 4.44772 5 5V21.382C5 21.9366 5.63316 22.2532 6.08579 21.8944L12 17.118L17.9142 21.8944C18.3668 22.2532 19 21.9366 19 21.382V5C19 4.44772 18.5523 4 18 4H6Z" />
                  </svg>
                )}
              </button>
              <span className="mr-2 text-sm text-gray-600">
                {t("exam.markForReview")}
              </span>
            </Stack>
            <Box display="flex" alignItems="center">
              <button
                onClick={handleToggleShowReject}
                style={{
                  width: 32,
                  height: 32,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  marginRight: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label={
                  showReject
                    ? t("exam.hideEliminateFunction")
                    : t("exam.showEliminateFunction")
                }
              >
                {showReject ? (
                  <VisibilityIcon sx={{ color: "#222", fontSize: 24 }} />
                ) : (
                  <VisibilityOffIcon sx={{ color: "#222", fontSize: 24 }} />
                )}
              </button>
              <span style={{ fontSize: 14, color: "#444" }}>
                {t("exam.eliminateChoices")}
              </span>
            </Box>
          </Stack>
        </Box>
        {/* Color bar (footer) */}
        <Box width="100%" display="flex" height={4}>
          {colorBarColorsQB.map((color, idx) => (
            <Box
              key={idx}
              sx={{
                height: 4,
                width: `${100 / colorBarColorsQB.length}%`,
                bgcolor: color,
                mr: idx !== colorBarColorsQB.length - 1 ? "0.1%" : 0,
              }}
            />
          ))}
        </Box>
      </Box>
      {/* Question */}
      {questionData.subQuestion && (
        <Box className="mb-4 text-base font-medium">
          <MathRenderer content={questionData.subQuestion} />
        </Box>
      )}
      {/* Options or Input */}
      <Box className="flex flex-col gap-3">
        {questionData.type === "TLN" ? (
          <input
            type="text"
            className="w-full px-4 py-3 text-base border-2 rounded focus:outline-none focus:border-blue-500 max-w-none"
            placeholder={t("exam.enterAnswer")}
            value={answer ?? ""}
            onChange={(e) => {
              let val = e.target.value;
              val = val.replace(/,/g, ".");
              // Kiểm tra format và giới hạn 5 số sau dấu thập phân
              // if (/^-?\d*(?:[\.\/]\d{0,5})?$/.test(val) || val === "") {
              if (/^-?\d*(?:\.\d{0,5}|\/\d*)?$/.test(val) || val === "") {
                onAnswer(val);
              }
            }}
            style={{ maxWidth: 400 }}
          />
        ) : (
          options.map((opt, idx) => (
            <Box
              key={idx}
              display="flex"
              alignItems="center"
              position="relative"
            >
              <button
                className={`flex items-center border-2 rounded px-4 py-3 text-left transition-all duration-150 w-full
                ${
                  answer === letters[idx]
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 bg-white"
                }
                hover:border-blue-400`}
                onClick={() => {
                  if (!rejectedOptions.includes(idx)) onAnswer(letters[idx]);
                }}
                style={{
                  flex: 1,
                  cursor: rejectedOptions.includes(idx)
                    ? "not-allowed"
                    : "pointer",
                  opacity: rejectedOptions.includes(idx) ? 0.5 : 1,
                }}
                disabled={rejectedOptions.includes(idx)}
              >
                <span
                  className={`w-7 h-7 flex items-center justify-center border-2 rounded-full mr-4 font-bold
                ${
                  answer === letters[idx]
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-400 bg-white text-gray-700"
                }`}
                >
                  {letters[idx]}
                </span>
                <Box
                  sx={{
                    textDecoration: rejectedOptions.includes(idx)
                      ? "line-through"
                      : "none",
                    color: rejectedOptions.includes(idx) ? "#888" : undefined,
                    transition: "color 0.15s",
                    flex: 1,
                  }}
                >
                  <MathRenderer content={opt} />
                </Box>
              </button>
              <Collapse in={showReject} orientation="horizontal" timeout={300}>
                <button
                  onClick={() => handleToggleReject(idx)}
                  style={{
                    marginLeft: 12,
                    width: 32,
                    height: 32,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "opacity 0.3s",
                  }}
                  aria-label={`${t("exam.eliminateAnswer")} ${letters[idx]}`}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      border: "2px solid #222",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 18,
                      color: rejectedOptions.includes(idx) ? "#888" : "#222",
                      background: rejectedOptions.includes(idx)
                        ? "#f5f5f5"
                        : "#fff",
                      textDecoration: rejectedOptions.includes(idx)
                        ? "line-through"
                        : "none",
                      transition: "color 0.15s, background 0.15s",
                    }}
                  >
                    {letters[idx]}
                  </span>
                </button>
              </Collapse>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
