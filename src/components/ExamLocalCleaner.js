import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { clearExamLocalStorage } from "../common/clearExamLocal";

export default function ExamLocalCleaner() {
  const location = useLocation();
  useEffect(() => {
    if (!location.pathname.includes("/exam")) {
      clearExamLocalStorage();
    }
  }, [location.pathname]);
  return null;
}
