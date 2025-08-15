import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { Assessment, School, Analytics } from "@mui/icons-material";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function PracticeSectionTabs({ tab, onTabChange }) {
  const { t } = useLanguage();

  const tabsConfig = [
    {
      icon: Assessment,
      label: t("scoreDetails.allQuestions") || "All Questions",
    },
    {
      icon: School,
      label: t("scoreDetails.readingWriting") || "TIẾNG ANH",
    },
    {
      icon: Analytics,
      label: t("scoreDetails.math") || "Math",
    },
  ];

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={tab}
        onChange={(_, v) => onTabChange(v)}
        sx={{
          px: 3,
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            minHeight: "60px",
            "&.Mui-selected": {
              background: "linear-gradient(135deg, #f44336 0%, #e91e63 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            },
          },
        }}
      >
        {tabsConfig.map((tabConfig, index) => {
          const IconComponent = tabConfig.icon;
          return (
            <Tab
              key={index}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconComponent />
                  {tabConfig.label}
                </Box>
              }
            />
          );
        })}
      </Tabs>
    </Box>
  );
}
