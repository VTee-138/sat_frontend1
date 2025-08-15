import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Button,
  IconButton,
} from "@mui/material";
import ColorBar from "./ColorBar";
import HomeIcon from "@mui/icons-material/Home";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Language } from "@mui/icons-material";
import { Calculator } from "lucide-react";
export default function Header({
  timeLeft,
  formatTime,
  colorBarColors,
  onRequestExit,
  examTitle,
  currentSubject,
  desmosOpen,
  onDesmosToggle,
  isTimeLeft = true,
}) {
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);

  const handleExitExam = () => {
    if (onRequestExit) {
      onRequestExit();
    }
  };

  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLanguageChange = (language) => {
    changeLanguage(language);
    setLanguageMenuAnchor(null);
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      zIndex={100}
      bgcolor="#fff"
    >
      {/* Top bar */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderBottom={1}
        borderColor="#e0e0e0"
        px={{ xs: "16px", sm: "40px" }}
        py={{ xs: "8px", sm: "16px" }}
      >
        <Box sx={{ flex: "1 1" }}>
          <Typography fontWeight={600} fontSize={20}>
            {examTitle || "SAT Practice Test"}
          </Typography>
        </Box>
        {isTimeLeft && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            <span>{formatTime(timeLeft)}</span>
          </Box>
        )}
        <Box
          sx={{
            flex: "1 1",
            textAlign: "right",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {currentSubject === "TOÁN" && (
            <Tooltip title="Desmos Calculator">
              <IconButton
                onClick={onDesmosToggle}
                sx={{
                  mr: 1,
                  color: desmosOpen ? "primary.main" : "text.secondary",
                  "&:hover": {
                    color: "primary.main",
                    bgcolor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                <Calculator size={25} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title={t("header.language")}>
            <Button
              onClick={handleLanguageMenuOpen}
              size="small"
              variant="outlined"
              sx={{
                minWidth: "auto",
                width: 40,
                height: 32,
                borderRadius: 2,
                borderColor: "grey.300",
                color: "text.secondary",
                px: 1,
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                  bgcolor: "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              <Language fontSize="small" />
            </Button>
          </Tooltip>

          <Menu
            anchorEl={languageMenuAnchor}
            open={Boolean(languageMenuAnchor)}
            onClose={handleLanguageMenuClose}
            sx={{ mt: 1 }}
          >
            <MenuItem
              onClick={() => handleLanguageChange("vi")}
              selected={currentLanguage === "vi"}
            >
              <ListItemIcon>
                <span style={{ fontSize: "1.2rem" }}>🇻🇳</span>
              </ListItemIcon>
              <ListItemText>{t("header.vietnamese")}</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => handleLanguageChange("en")}
              selected={currentLanguage === "en"}
            >
              <ListItemIcon>
                <span style={{ fontSize: "1.2rem" }}>🇺🇸</span>
              </ListItemIcon>
              <ListItemText>{t("header.english")}</ListItemText>
            </MenuItem>
          </Menu>

          <HomeIcon
            onClick={handleExitExam}
            sx={{
              ml: 1,
              cursor: "pointer",
              color: "#3954d9",
              fontSize: 28,
              transition: "color 0.2s",
              "&:hover": { color: "#cd1628" },
            }}
            titleAccess={t("exam.exitToHome")}
          />
        </Box>
      </Box>
      {/* Color bar (header) */}
      <ColorBar colorBarColors={colorBarColors} />
    </Box>
  );
}
