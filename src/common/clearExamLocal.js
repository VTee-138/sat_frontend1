export function clearExamLocalStorage(preserveSubjectModule = false) {
  const keysToPreserve = preserveSubjectModule
    ? ["exam_currentSubject", "exam_currentModule"]
    : [];

  Object.keys(localStorage).forEach((key) => {
    if (
      (key.startsWith("exam_") ||
        key.startsWith("highlighted_passage_") ||
        key.startsWith("rejected_options_")) &&
      !keysToPreserve.includes(key)
    ) {
      localStorage.removeItem(key);
    }
  });

  // Explicitly clear start time and assessment ID
  localStorage.removeItem("exam_start_time");
  localStorage.removeItem("exam_assessment_id");
}
