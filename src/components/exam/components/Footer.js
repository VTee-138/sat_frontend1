import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ColorBar from "./ColorBar";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function Footer({
  current,
  questions,
  handleBack,
  handleNext,
  setShowModal,
  logo,
  colorBarColors,
  isSubmitting = false,
}) {
  const { t } = useLanguage();

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      width="100%"
      zIndex={100}
      bgcolor="#fff"
    >
      {/* Color bar (footer) */}
      <ColorBar colorBarColors={colorBarColors} />
      {/* Responsive footer: desktop 3 cột, mobile 2 hàng */}
      <Box
        sx={{
          px: { xs: 1, sm: 5, md: 10 },
          py: { xs: 1, sm: 2, md: 4 },
          borderTop: 1,
          borderColor: "#e0e0e0",
          display: { xs: "block", md: "flex" },
          alignItems: { md: "center" },
          justifyContent: { md: "space-between" },
        }}
      >
        {/* Desktop: 3 cột, Mobile: 2 hàng */}
        {/* Hàng 1 mobile: Question (căn giữa) */}
        <Box
          display={{ xs: "flex", md: "none" }}
          justifyContent="center"
          mb={1}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "#000",
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 2,
              minWidth: 120,
              boxShadow: 0,
              transition: "opacity 0.15s",
              "&:hover": {
                opacity: 0.7,
                bgcolor: "#000",
              },
            }}
            onClick={() => setShowModal(true)}
          >
            {`${t("exam.question")} ${current + 1} ${t("exam.of")} ${
              questions.length
            }`}
          </Button>
        </Box>
        {/* Hàng 2 mobile: bluebook.plus trái, Back/Next phải */}
        <Box
          display={{ xs: "flex", md: "none" }}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          gap={1}
        >
          <img src={logo} alt="logo" style={{ height: 32, marginRight: 8 }} />
          <Box display="flex" flexDirection="row" gap={1}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#3954d9",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                px: "12px",
                py: "6px",
                borderRadius: "24px",
                boxShadow: 0,
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:disabled": { bgcolor: "#bfc8f7" },
                lineHeight: 1,
              }}
              onClick={handleBack}
              disabled={current === 0}
            >
              {t("exam.back")}
            </Button>
            {current === questions.length - 1 ? (
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#3954d9",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  px: "12px",
                  py: "6px",
                  borderRadius: "24px",
                  boxShadow: 0,
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:disabled": { bgcolor: "#bfc8f7" },
                  lineHeight: 1,
                }}
                onClick={handleNext}
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
              >
                {isSubmitting ? t("common.loading") : t("exam.submit")}
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#3954d9",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  px: "12px",
                  py: "6px",
                  borderRadius: "24px",
                  boxShadow: 0,
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:disabled": { bgcolor: "#bfc8f7" },
                  lineHeight: 1,
                }}
                onClick={handleNext}
                disabled={current === questions.length - 1}
              >
                {t("exam.next")}
              </Button>
            )}
          </Box>
        </Box>
        {/* Desktop: 3 cột */}
        <Box display={{ xs: "none", md: "flex" }} flex={1} alignItems="center">
          <img src={logo} alt="logo" style={{ height: 32, marginRight: 8 }} />
        </Box>
        <Box
          display={{ xs: "none", md: "flex" }}
          flex={1}
          justifyContent="center"
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "#000",
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 2,
              minWidth: 180,
              boxShadow: 0,
              transition: "opacity 0.15s",
              "&:hover": {
                opacity: 0.7,
                bgcolor: "#000",
              },
            }}
            onClick={() => setShowModal(true)}
          >
            {`${t("exam.question")} ${current + 1} ${t("exam.of")} ${
              questions.length
            }`}
          </Button>
        </Box>
        <Box
          display={{ xs: "none", md: "flex" }}
          flex={1}
          justifyContent="flex-end"
          gap={3}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "#3954d9",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              px: "24px",
              py: "16px",
              borderRadius: "24px",
              boxShadow: 0,
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:disabled": { bgcolor: "#bfc8f7" },
              lineHeight: 1,
            }}
            onClick={handleBack}
            disabled={current === 0}
          >
            {t("exam.back")}
          </Button>
          {current === questions.length - 1 ? (
            <Button
              variant="contained"
              sx={{
                bgcolor: "#3954d9",
                color: "#fff",
                fontWeight: 600,
                fontSize: 16,
                px: "24px",
                py: "16px",
                borderRadius: "24px",
                boxShadow: 0,
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:disabled": { bgcolor: "#bfc8f7" },
                lineHeight: 1,
              }}
              onClick={handleNext}
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={18} color="inherit" />
                ) : null
              }
            >
              {isSubmitting ? t("common.loading") : t("exam.submit")}
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                bgcolor: "#3954d9",
                color: "#fff",
                fontWeight: 600,
                fontSize: 16,
                px: "24px",
                py: "16px",
                borderRadius: "24px",
                boxShadow: 0,
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:disabled": { bgcolor: "#bfc8f7" },
                lineHeight: 1,
              }}
              onClick={handleNext}
              disabled={current === questions.length - 1}
            >
              {t("exam.next")}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
