import React from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { MapPinCheckInside } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function QuestionNavModal({
  open,
  onClose,
  questions,
  current,
  marked,
  answers,
  handleSelect,
  examTitle,
}) {
  const { t } = useLanguage();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          p: 0,
          minWidth: { xs: "100vw", sm: 600 },
          bgcolor: "#fff",
          position: "fixed",
          left: "50%",
          bottom: { xs: 0, sm: 40 },
          top: "unset",
          transform: "translateX(-50%)",
          width: { xs: "100vw", sm: "auto" },
          m: 0,
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ p: { xs: 1, sm: 3 }, pb: 0 }}>
        {/* Header with centered title and close icon */}
        <Box
          position="relative"
          minHeight={{ xs: 40, sm: 56 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            fontWeight={700}
            fontSize={{ xs: 18, sm: 24 }}
            sx={{
              mb: 0.5,
              width: "100%",
              textAlign: "center",
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {examTitle || "SAT Practice Test"}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              position: "absolute",
              right: { xs: -10, sm: -20 },
              top: { xs: -10, sm: -20 },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box borderBottom={1} borderColor="#e0e0e0" mt={1} mb={"8px"} />
        {/* Legend */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={"8px 16px"}
          mb={"8px"}
          flexWrap="wrap"
        >
          {/* Current */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <MapPinCheckInside />
            <Typography fontSize={{ xs: 13, sm: 16 }}>
              {t("exam.current")}
            </Typography>
          </Box>
          {/* Unanswered */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: { xs: 16, sm: 20 },
                height: { xs: 16, sm: 20 },
                border: "2px dashed #222",
                borderRadius: "4px",
                background: "#fff",
              }}
            />
            <Typography fontSize={{ xs: 13, sm: 16 }}>
              {t("exam.notAnswered")}
            </Typography>
          </Box>
          {/* Answered */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: { xs: 16, sm: 20 },
                height: { xs: 16, sm: 20 },
                border: "2px solid #1976d2",
                borderRadius: "4px",
                background: "#fff",
              }}
            />
            <Typography fontSize={{ xs: 13, sm: 16 }} sx={{ color: "#1976d2" }}>
              {t("exam.answered")}
            </Typography>
          </Box>
          {/* For Review */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="#C80019"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 4C5.44772 4 5 4.44772 5 5V21.382C5 21.9366 5.63316 22.2532 6.08579 21.8944L12 17.118L17.9142 21.8944C18.3668 22.2532 19 21.9366 19 21.382V5C19 4.44772 18.5523 4 18 4H6Z"
                fill="#C80019"
              />
            </svg>
            <Typography fontSize={{ xs: 13, sm: 16 }}>
              {t("exam.forReview")}
            </Typography>
          </Box>
        </Box>
        <Box borderBottom={1} borderColor="#e0e0e0" />
        {/* Grid of question numbers */}
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(6, 1fr)",
            sm: "repeat(8, 1fr)",
            md: `repeat(10, 1fr)`,
          }}
          gap={"25px 10px"}
          justifyContent="center"
          mb={3}
          px={1}
          sx={{
            pt: "25px",
            maxHeight: { xs: "260px", md: "450px" },
            overflowY: "auto",
          }}
        >
          {questions.map((q, idx) => {
            // Determine state
            const isCurrent = idx === current;
            const isMarked = marked[idx];
            const isAnswered =
              answers[idx] !== undefined &&
              answers[idx] !== null &&
              answers[idx] !== "";
            // Style
            let border = "2px dashed #222";
            let color = "#1976d2";
            if (isAnswered) border = "2px solid #1976d2";
            // Button
            return (
              <Box
                key={idx}
                sx={{
                  position: "relative",
                  width: { xs: "100%", sm: 48 },
                  height: 48,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Current icon above button */}
                {isCurrent && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -25,
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 2,
                    }}
                  >
                    <MapPinCheckInside fontSize={{ xs: 13, sm: 16 }} />
                  </Box>
                )}
                <Button
                  sx={{
                    width: { xs: "100%", sm: 48 },
                    height: { xs: "100%", sm: 48 },
                    minWidth: { xs: "100%", sm: 48 },
                    minHeight: { xs: "100%", sm: 48 },
                    border,
                    borderRadius: 2,
                    color,
                    fontWeight: 700,
                    fontSize: { xs: 18, sm: 20 },
                    boxShadow: 0,
                    p: 0,
                    bgcolor: "#fff",
                    position: "relative",
                    zIndex: 1,
                    borderStyle: isAnswered ? "solid" : "dashed",
                    transition: "border 0.15s, color 0.15s, background 0.15s",
                    "&:hover": {
                      backgroundColor: "#fff",
                      borderColor: border.split(" ")[2],
                      borderStyle: isAnswered ? "solid" : "dashed",
                      color: color,
                      boxShadow: "none",
                    },
                  }}
                  onClick={() => handleSelect(idx)}
                >
                  {idx + 1}
                </Button>
                {/* For Review icon */}
                {isMarked && (
                  <Box
                    sx={{ position: "absolute", right: 2, top: 2, zIndex: 2 }}
                  >
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 24 24"
                      fill="#C80019"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 4C5.44772 4 5 4.44772 5 5V21.382C5 21.9366 5.63316 22.2532 6.08579 21.8944L12 17.118L17.9142 21.8944C18.3668 22.2532 19 21.9366 19 21.382V5C19 4.44772 18.5523 4 18 4H6Z"
                        fill="#C80019"
                      />
                    </svg>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Dialog>
  );
}
