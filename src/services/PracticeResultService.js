import { get, post, put } from "../common/apiClient";

const PATH_PRACTICE_RESULT = "/practice-result";

// =================== PRACTICE SUBMISSION ===================

/**
 * Nộp bài luyện tập
 * @param {Object} userAnswers - Object chứa câu trả lời { "questionId": "answer" }
 * @param {Array} questions - Mảng ID các câu hỏi
 * @returns {Promise} Response từ server với kết quả chi tiết
 */
const submitPractice = async (userAnswers) => {
  return await post(PATH_PRACTICE_RESULT + "/submit", {
    userAnswers,
  });
};

// =================== PRACTICE GENERATION ===================

/**
 * Luyện tập theo dạng bài - Random câu hỏi sai theo questionType
 * @param {Object} params - Tham số luyện tập
 * @param {string} params.questionType - Mã dạng bài (required)
 * @param {number} params.numberOfQuestions - Số câu hỏi cần lấy (1-50) (required)
 * @param {string} params.subject - "MATH" | "ENGLISH" (optional)
 * @returns {Promise} Response từ server với danh sách câu hỏi luyện tập
 */
const practiceByQuestionType = async (params) => {
  const { questionType, numberOfQuestions, subject } = params;

  const body = {
    questionType,
    numberOfQuestions,
  };

  if (subject) {
    body.subject = subject;
  }

  return await post(PATH_PRACTICE_RESULT + "/practice-by-type", body);
};

/**
 * Luyện tập tất cả - Random câu hỏi sai từ tất cả các dạng bài
 * @param {Object} params - Tham số luyện tập
 * @param {number} params.numberOfQuestions - Số câu hỏi cần lấy (1-50) (required)
 * @param {string} params.subject - "MATH" | "ENGLISH" (optional)
 * @returns {Promise} Response từ server với danh sách câu hỏi luyện tập
 */
const practiceAllIncorrect = async (params) => {
  const { numberOfQuestions, subject } = params;

  const body = { numberOfQuestions };

  if (subject) {
    body.subject = subject;
  }

  return await post(PATH_PRACTICE_RESULT + "/practice-all", body);
};

// =================== STATISTICS ===================

/**
 * Lấy thống kê tổng quan của user
 * @returns {Promise} Response từ server với thống kê tổng quan
 */
const getUserPracticeStats = async () => {
  return await get(PATH_PRACTICE_RESULT + "/stats");
};
const updatePracticeNote = async (params) => {
  return await put(PATH_PRACTICE_RESULT + "/update-note", params);
};

/**
 * Lấy thống kê theo môn học
 * @param {string} subject - "MATH" | "ENGLISH"
 * @returns {Promise} Response từ server với thống kê theo môn
 */
const getPracticeStatsBySubject = async (subject) => {
  return await get(PATH_PRACTICE_RESULT + `/stats/${subject}`);
};

/**
 * Lấy thống kê chi tiết theo loại câu hỏi
 * @param {string} subject - "MATH" | "ENGLISH" (optional)
 * @returns {Promise} Response từ server với thống kê chi tiết
 */
const getPracticeStatsByType = async (subject) => {
  const params = new URLSearchParams();
  if (subject) {
    params.append("subject", subject);
  }

  const query = params.toString() ? `?${params.toString()}` : "";
  return await get(PATH_PRACTICE_RESULT + `/stats-by-type${query}`);
};

// =================== INCORRECT QUESTIONS ===================

/**
 * Lấy danh sách câu hỏi đã trả lời sai
 * @param {Object} filters - Các bộ lọc
 * @param {number} filters.page - Trang hiện tại (default: 1)
 * @param {number} filters.limit - Số bản ghi mỗi trang (default: 20)
 * @param {string} filters.subject - "MATH" | "ENGLISH" (optional)
 * @param {string} filters.questionType - Mã loại câu hỏi (optional)
 * @param {string} filters.difficulty - "EASY" | "MEDIUM" | "HARD" (optional)
 * @returns {Promise} Response từ server với danh sách câu hỏi sai
 */
const getIncorrectQuestions = async () => {
  return await get(PATH_PRACTICE_RESULT + `/incorrect-questions`);
};

// =================== PRACTICE HISTORY ===================

/**
 * Lấy lịch sử làm bài gần đây
 * @param {number} page - Trang hiện tại (default: 1)
 * @param {number} limit - Số bản ghi mỗi trang (default: 20)
 * @returns {Promise} Response từ server với lịch sử làm bài
 */
const getPracticeHistory = async (page = 1, limit = 20) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);

  return await get(PATH_PRACTICE_RESULT + `/history?${params.toString()}`);
};

/**
 * Lưu kết quả làm bài
 * @param {Object} result - Kết quả làm bài
 * @param {string} result.questionId - ID câu hỏi
 * @param {boolean} result.isCorrect - Đúng hay sai
 * @returns {Promise} Response từ server
 */
const savePracticeResult = async (result) => {
  return await post(PATH_PRACTICE_RESULT + "/save", result);
};

// =================== STATUS MANAGEMENT ===================

/**
 * Cập nhật status của practice result
 * @param {Object} params - Tham số cập nhật
 * @param {string} params.questionId - ID của câu hỏi
 * @param {string} params.status - "need_to_review" | "learned"
 * @returns {Promise} Response từ server
 */
const updatePracticeStatus = async (params) => {
  return await put(PATH_PRACTICE_RESULT + "/update-status", params);
};

/**
 * Cập nhật status hàng loạt
 * @param {Array} updates - Mảng các update
 * @param {string} updates[].questionId - ID của câu hỏi
 * @param {string} updates[].status - "need_to_review" | "learned"
 * @returns {Promise} Response từ server
 */
const updateMultiplePracticeStatus = async (updates) => {
  return await put(PATH_PRACTICE_RESULT + "/update-multiple-status", {
    updates,
  });
};

// =================== HELPER FUNCTIONS ===================

/**
 * Tính toán accuracy percentage
 * @param {number} correct - Số câu đúng
 * @param {number} total - Tổng số câu
 * @returns {number} Phần trăm accuracy (làm tròn 2 chữ số thập phân)
 */
const calculateAccuracy = (correct, total) => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100 * 100) / 100;
};

/**
 * Tính toán progress percentage
 * @param {number} answered - Số câu đã trả lời
 * @param {number} total - Tổng số câu
 * @returns {number} Phần trăm progress (làm tròn 2 chữ số thập phân)
 */
const calculateProgress = (answered, total) => {
  if (total === 0) return 0;
  return Math.round((answered / total) * 100 * 100) / 100;
};

/**
 * Format practice result để hiển thị
 * @param {Object} result - Kết quả practice
 * @returns {Object} Formatted result
 */
const formatPracticeResult = (result) => {
  return {
    questionId: result.questionId,
    isCorrect: result.isCorrect,
    userAnswer: result.userAnswer,
    correctAnswer: result.question?.correctAnswer,
    question: result.question?.contentQuestion,
    subject: result.question?.subject,
    difficulty: result.question?.difficulty,
    questionType: result.question?.questionType,
    explanation: result.question?.explanation,
    createdAt: result.createdAt,
    status: result.status || "need_to_review",
  };
};

/**
 * Group practice results by subject
 * @param {Array} results - Mảng kết quả practice
 * @returns {Object} Grouped results { MATH: [], ENGLISH: [] }
 */
const groupResultsBySubject = (results) => {
  return results.reduce((grouped, result) => {
    const subject = result.question?.subject || "UNKNOWN";
    if (!grouped[subject]) {
      grouped[subject] = [];
    }
    grouped[subject].push(result);
    return grouped;
  }, {});
};

/**
 * Group practice results by difficulty
 * @param {Array} results - Mảng kết quả practice
 * @returns {Object} Grouped results { EASY: [], MEDIUM: [], HARD: [] }
 */
const groupResultsByDifficulty = (results) => {
  return results.reduce((grouped, result) => {
    const difficulty = result.question?.difficulty || "UNKNOWN";
    if (!grouped[difficulty]) {
      grouped[difficulty] = [];
    }
    grouped[difficulty].push(result);
    return grouped;
  }, {});
};

/**
 * Group practice results by question type
 * @param {Array} results - Mảng kết quả practice
 * @returns {Object} Grouped results by question type code
 */
const groupResultsByQuestionType = (results) => {
  return results.reduce((grouped, result) => {
    const questionType = result.question?.questionType?.code || "UNKNOWN";
    if (!grouped[questionType]) {
      grouped[questionType] = [];
    }
    grouped[questionType].push(result);
    return grouped;
  }, {});
};

/**
 * Filter incorrect questions only
 * @param {Array} results - Mảng kết quả practice
 * @returns {Array} Chỉ các câu trả lời sai
 */
const getIncorrectResults = (results) => {
  return results.filter((result) => !result.isCorrect);
};

/**
 * Filter correct questions only
 * @param {Array} results - Mảng kết quả practice
 * @returns {Array} Chỉ các câu trả lời đúng
 */
const getCorrectResults = (results) => {
  return results.filter((result) => result.isCorrect);
};

/**
 * Get practice summary statistics
 * @param {Array} results - Mảng kết quả practice
 * @returns {Object} Summary statistics
 */
const getPracticeSummary = (results) => {
  const total = results.length;
  const correct = getCorrectResults(results).length;
  const incorrect = getIncorrectResults(results).length;

  const bySubject = groupResultsBySubject(results);
  const byDifficulty = groupResultsByDifficulty(results);
  const byQuestionType = groupResultsByQuestionType(results);

  return {
    total,
    correct,
    incorrect,
    accuracy: calculateAccuracy(correct, total),
    bySubject: Object.keys(bySubject).map((subject) => ({
      subject,
      count: bySubject[subject].length,
      correct: getCorrectResults(bySubject[subject]).length,
      incorrect: getIncorrectResults(bySubject[subject]).length,
      accuracy: calculateAccuracy(
        getCorrectResults(bySubject[subject]).length,
        bySubject[subject].length
      ),
    })),
    byDifficulty: Object.keys(byDifficulty).map((difficulty) => ({
      difficulty,
      count: byDifficulty[difficulty].length,
      correct: getCorrectResults(byDifficulty[difficulty]).length,
      incorrect: getIncorrectResults(byDifficulty[difficulty]).length,
      accuracy: calculateAccuracy(
        getCorrectResults(byDifficulty[difficulty]).length,
        byDifficulty[difficulty].length
      ),
    })),
    byQuestionType: Object.keys(byQuestionType).map((questionType) => ({
      questionType,
      count: byQuestionType[questionType].length,
      correct: getCorrectResults(byQuestionType[questionType]).length,
      incorrect: getIncorrectResults(byQuestionType[questionType]).length,
      accuracy: calculateAccuracy(
        getCorrectResults(byQuestionType[questionType]).length,
        byQuestionType[questionType].length
      ),
    })),
  };
};

export {
  // Practice Submission
  submitPractice,

  // Practice Generation
  practiceByQuestionType,
  practiceAllIncorrect,

  // Statistics
  getUserPracticeStats,
  getPracticeStatsBySubject,
  getPracticeStatsByType,

  // Incorrect Questions
  getIncorrectQuestions,

  // Practice History
  getPracticeHistory,
  savePracticeResult,

  // Status Management
  updatePracticeStatus,
  updateMultiplePracticeStatus,

  // Helper Functions
  calculateAccuracy,
  calculateProgress,
  formatPracticeResult,
  groupResultsBySubject,
  groupResultsByDifficulty,
  groupResultsByQuestionType,
  getIncorrectResults,
  getCorrectResults,
  getPracticeSummary,
  updatePracticeNote,
};
