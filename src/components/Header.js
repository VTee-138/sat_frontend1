import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Person,
  Logout,
  Language,
  Edit,
  Psychology,
  MenuBook,
  Error,
  Menu as MenuIcon,
  Close,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserInfo, logout } from "../services/AuthService";
import { useLanguage } from "../contexts/LanguageContext";
import logo from "../images/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const [userInfo, setUserInfo] = useState(null);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userName = userInfo?.fullName || "Student Name";

  // Navigation items
  const navItems = [
    {
      label: t("home.practiceTests"),
      path: "/exam-list",
      icon: <Edit />,
      color: "#2563eb",
    },
    {
      label: t("home.examSystem"),
      path: "/practice",
      icon: <Psychology />,
      color: "#0891b2",
    },
    {
      label: t("home.vocabularyManager"),
      path: "/vocabulary-manager",
      icon: <MenuBook />,
      color: "#2563eb",
    },
    {
      label: t("home.examDiscovery"),
      path: "/error-logs",
      icon: <Error />,
      color: "#dc2626",
    },
  ];

  useEffect(() => {
    const loadUserInfo = () => {
      const user = getUserInfo();
      setUserInfo(user);
    };

    loadUserInfo();

    // Lắng nghe sự thay đổi của localStorage (từ tab khác)
    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === "jwt") {
        loadUserInfo();
      }
    };

    // Lắng nghe custom event userLogout
    const handleUserLogout = () => {
      setUserInfo(null);
    };

    // Lắng nghe custom event userInfoChanged
    const handleUserInfoChanged = () => {
      loadUserInfo();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLogout", handleUserLogout);
    window.addEventListener("userInfoChanged", handleUserInfoChanged);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLogout", handleUserLogout);
      window.removeEventListener("userInfoChanged", handleUserInfoChanged);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUserInfo(null); // Cập nhật state ngay lập tức
    navigate("/login");
  };

  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    handleLanguageMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 4 },
          py: 2,
          bgcolor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: "72px",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            width: "30%",
            "&:hover": {
              opacity: 0.8,
            },
          }}
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="10SAT Logo"
            style={{
              height: "25px",
              width: "auto",
            }}
          />
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              py: 1,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: "120px",
                  height: "68px",
                  borderRadius: 3,
                  px: 2,
                  py: 1.5,
                  mx: 0.5,
                  my: 0.5,
                  bgcolor: isActivePath(item.path)
                    ? `${item.color}15`
                    : "transparent",
                  border: isActivePath(item.path)
                    ? `2px solid ${item.color}`
                    : "2px solid transparent",
                  color: isActivePath(item.path) ? item.color : "#666",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: `${item.color}10`,
                    borderColor: `${item.color}60`,
                    color: item.color,
                    transform: "translateY(-1px)",
                    boxShadow: `0 2px 8px ${item.color}20`,
                  },
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <Box sx={{ mb: 0.8, color: "inherit" }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 24 } })}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "13px",
                    fontWeight: isActivePath(item.path) ? 600 : 500,
                    lineHeight: 1.2,
                    color: "inherit",
                    textAlign: "center",
                  }}
                >
                  {item.label}
                </Typography>
              </Button>
            ))}
          </Box>
        )}

        {/* User Info & Controls */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "flex-end",
            width: "30%",
          }}
        >
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={toggleMobileMenu}
              sx={{
                mr: 1,
                color: "#666",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Language Switcher */}
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

          {userInfo && (
            <>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#1976d2",
                  fontSize: "0.875rem",
                }}
              >
                <Person fontSize="small" />
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "#333",
                  display: { xs: "none", sm: "block" },
                  whiteSpace: "nowrap",
                }}
              >
                {userName}
              </Typography>
              <Tooltip title={t("header.logout")}>
                <IconButton
                  onClick={handleLogout}
                  size="small"
                  sx={{
                    ml: 1,
                    color: "#666",
                    "&:hover": {
                      color: "#d32f2f",
                      bgcolor: "rgba(211, 47, 47, 0.04)",
                    },
                  }}
                >
                  <Logout fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>

        {/* Language Menu */}
        <Menu
          anchorEl={languageMenuAnchor}
          open={Boolean(languageMenuAnchor)}
          onClose={handleLanguageMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              mt: 0.5,
              minWidth: 120,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
          }}
        >
          <MenuItem
            onClick={() => handleLanguageChange("vi")}
            selected={currentLanguage === "vi"}
            sx={{
              fontSize: "0.875rem",
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              },
            }}
          >
            🇻🇳 {t("header.vietnamese")}
          </MenuItem>
          <MenuItem
            onClick={() => handleLanguageChange("en")}
            selected={currentLanguage === "en"}
            sx={{
              fontSize: "0.875rem",
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              },
            }}
          >
            🇺🇸 {t("header.english")}
          </MenuItem>
        </Menu>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: "#fafafa",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
            Menu
          </Typography>
          <IconButton onClick={toggleMobileMenu}>
            <Close />
          </IconButton>
        </Box>

        <List sx={{ pt: 2 }}>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 1, px: 2 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActivePath(item.path)
                    ? `${item.color}15`
                    : "transparent",
                  border: isActivePath(item.path)
                    ? `1px solid ${item.color}30`
                    : "1px solid transparent",
                  "&:hover": {
                    bgcolor: `${item.color}10`,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActivePath(item.path) ? item.color : "#666",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontSize: "0.95rem",
                      fontWeight: isActivePath(item.path) ? 600 : 500,
                      color: isActivePath(item.path) ? item.color : "#333",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
