import { useCallback } from "react";

export default function useSectionName(currentLanguage, section) {
  return useCallback(
    (section) => {
      if (section === "TIẾNG ANH") {
        return currentLanguage === "en" ? "English" : "TIẾNG ANH";
      }
      if (section === "TOÁN") {
        return currentLanguage === "en" ? "Math" : "TOÁN";
      }
      return section;
    },
    [currentLanguage]
  );
}
