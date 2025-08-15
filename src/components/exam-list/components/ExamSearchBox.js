import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useLanguage } from "../../../contexts/LanguageContext";

const ExamSearchBox = ({ inputValue, loading, onInputChange }) => {
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", sm: 600 },
        mx: "auto",
        mb: 4,
        px: { xs: 1, sm: 0 },
      }}
    >
      <TextField
        fullWidth
        placeholder={t("examList.searchPlaceholder")}
        value={inputValue}
        onChange={onInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "#666" }} />
            </InputAdornment>
          ),
          // endAdornment: loading ? (
          //   <InputAdornment position="end">
          //     <CircularProgress color="inherit" size={20} />
          //   </InputAdornment>
          // ) : null,
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "#fff",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            "& fieldset": {
              borderColor: "#e0e0e0",
            },
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2",
            },
          },
        }}
      />
    </Box>
  );
};

export default ExamSearchBox;
