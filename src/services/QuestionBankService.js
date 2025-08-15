import { get, post, del, put } from "../common/apiClient";

const PATH_QUESTION_BANK = "/question-bank";

// =================== CRUD OPERATIONS ===================

/**
 * Tạo câu hỏi mới (chỉ admin)
 * @param {Object} questionData - Dữ liệu câu hỏi
 * @param {string} questionData.contentQuestion - Nội dung câu hỏi
 * @param {Object} questionData.correctAnswer - Đáp án đúng
 * @param {string} questionData.subject - "MATH" | "ENGLISH"
 * @param {string} questionData.type - "TN" | "TLN"
 * @param {string} questionData.explanation - Giải thích (optional)
 * @param {string} questionData.difficulty - "EASY" | "MEDIUM" | "HARD"
 * @param {string} questionData.questionType - Loại câu hỏi
 * @returns {Promise} Response từ server
 */
const createQuestion = async (questionData) => {
  return await post(PATH_QUESTION_BANK + "/create", questionData);
};

/**
 * Tạo nhiều câu hỏi cùng lúc (chỉ admin)
 * @param {Array} questions - Mảng các câu hỏi
 * @returns {Promise} Response từ server
 */
const createMultipleQuestions = async (questions) => {
  return await post(PATH_QUESTION_BANK + "/create-multiple", { questions });
};

/**
 * Lấy danh sách câu hỏi với phân trang và filter
 * @param {number} page - Trang hiện tại (default: 1)
 * @param {number} limit - Số câu hỏi mỗi trang (default: 10)
 * @param {Object} filters - Các bộ lọc
 * @param {string} filters.subject - "MATH" | "ENGLISH"
 * @param {string} filters.type - "TN" | "TLN"
 * @param {string} filters.difficulty - "EASY" | "MEDIUM" | "HARD"
 * @param {string} filters.questionType - Loại câu hỏi (search by code)
 * @param {string} filters.search - Tìm kiếm theo nội dung
 * @returns {Promise} Response từ server
 */
const getQuestions = async (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);

  if (filters.subject) params.append("subject", filters.subject);
  if (filters.type) params.append("type", filters.type);
  if (filters.difficulty) params.append("difficulty", filters.difficulty);
  if (filters.questionType) params.append("questionType", filters.questionType);
  if (filters.search) params.append("search", filters.search);

  return await get(PATH_QUESTION_BANK + `?${params.toString()}`);
};
const getQuestionTypes = async (subject) => {
  return await get(PATH_QUESTION_BANK + `/types?subject=${subject}`);
};

/**
 * Tìm kiếm câu hỏi nâng cao
 * @param {Object} searchParams - Tham số tìm kiếm
 * @param {number} searchParams.page - Trang hiện tại
 * @param {number} searchParams.limit - Số câu hỏi mỗi trang
 * @param {string} searchParams.search - Từ khóa tìm kiếm
 * @param {Array} searchParams.subjects - Mảng môn học ["MATH", "ENGLISH"]
 * @param {Array} searchParams.types - Mảng loại câu hỏi ["TN", "TLN"]
 * @param {Array} searchParams.difficulties - Mảng độ khó
 * @param {Array} searchParams.questionTypes - Mảng loại câu hỏi
 * @param {string} searchParams.sortBy - Sắp xếp theo trường
 * @param {string} searchParams.sortOrder - "asc" | "desc"
 * @returns {Promise} Response từ server
 */
const searchQuestions = async (searchParams) => {
  return await post(PATH_QUESTION_BANK + "/search", searchParams);
};

/**
 * Lấy câu hỏi theo ID
 * @param {string} id - ID câu hỏi
 * @returns {Promise} Response từ server
 */
const getQuestionById = async (id) => {
  return await get(PATH_QUESTION_BANK + `/${id}`);
};

/**
 * Cập nhật câu hỏi (chỉ admin)
 * @param {string} id - ID câu hỏi
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Promise} Response từ server
 */
const updateQuestion = async (id, updateData) => {
  return await put(PATH_QUESTION_BANK + `/${id}`, updateData);
};

/**
 * Xóa câu hỏi (chỉ admin)
 * @param {string} id - ID câu hỏi
 * @returns {Promise} Response từ server
 */
const deleteQuestion = async (id) => {
  return await del(PATH_QUESTION_BANK + `/${id}`);
};

/**
 * Xóa nhiều câu hỏi (chỉ admin)
 * @param {Array} ids - Mảng ID câu hỏi
 * @returns {Promise} Response từ server
 */
const deleteMultipleQuestions = async (ids) => {
  return await del(PATH_QUESTION_BANK, { data: { ids } });
};

// =================== STATISTICS ===================

/**
 * Lấy thống kê câu hỏi
 * @returns {Promise} Response từ server với thống kê tổng quan
 */
const getQuestionStats = async () => {
  return await get(PATH_QUESTION_BANK + "/stats");
};

const getAllQuestionsByCategory = async () => {
  return await get(PATH_QUESTION_BANK + "/categories/count");
};

const getAllQuestionsByType = async (params) => {
  return await get(PATH_QUESTION_BANK + "/by-type", { params });
};

// =================== EXAM GENERATION ===================

/**
 * Lấy thống kê để tạo đề
 * @returns {Promise} Response từ server
 */
const getExamGenerationStats = async () => {
  return await get(PATH_QUESTION_BANK + "/exam-stats");
};

/**
 * Tạo đề thi với filter (chỉ admin)
 * @param {Object} examParams - Tham số tạo đề
 * @param {string} examParams.subject - "MATH" | "ENGLISH"
 * @param {Array} examParams.filters - Mảng các bộ filter
 * @param {string} examParams.filters[].questionType - Mã dạng bài
 * @param {number} examParams.filters[].numberOfQuestions - Số câu hỏi (1-50)
 * @param {string} examParams.filters[].difficulty - "EASY" | "MEDIUM" | "HARD"
 * @returns {Promise} Response từ server
 */
const generateFilteredExam = async (examParams) => {
  return await post(PATH_QUESTION_BANK + "/generate-filtered-exam", examParams);
};

/**
 * Tạo đề thi random (chỉ admin)
 * @param {Object} examParams - Tham số tạo đề
 * @param {string} examParams.subject - "MATH" | "ENGLISH"
 * @param {number} examParams.numberOfQuestions - Số câu hỏi
 * @returns {Promise} Response từ server
 */
const generateRandomExam = async (examParams) => {
  return await post(PATH_QUESTION_BANK + "/generate-random-exam", examParams);
};

// =================== HELPER FUNCTIONS ===================

/**
 * Lấy danh sách question types theo môn học
 * @param {string} subject - "MATH" | "ENGLISH"
 * @returns {Array} Mảng các question type codes
 */
const getQuestionTypesBySubject = (subject) => {
  const questionTypes = {
    ENGLISH: [
      "craft_and_structure_cross_text_connections",
      "craft_and_structure_text_structure_and_purpose",
      "craft_and_structure_words_in_context",
      "expression_of_ideas_rhetorical_synthesis",
      "expression_of_ideas_transitions",
      "information_and_ideas_central_ideas_and_details",
      "information_and_ideas_command_of_evidence",
      "information_and_ideas_inferences",
      "standard_english_conventions_boundaries",
      "standard_english_conventions_form_structure_and_sense",
    ],
    MATH: [
      "algebra_linear_equations_in_one_variable",
      "algebra_linear_functions",
      "algebra_linear_equations_in_two_variables",
      "algebra_systems_of_two_linear_equations_in_two_variables",
      "algebra_linear_inequalities_in_one_or_two_variables",
      "advanced_math_equivalent_expressions",
      "advanced_math_nonlinear_equations_in_one_variable_and_systems_of_equations_in_two_variables",
      "advanced_math_nonlinear_functions",
      "problem_solving_and_data_analysis_ratios_rates_proportional_relationships_and_units",
      "problem_solving_and_data_analysis_percentages",
      "problem_solving_and_data_analysis_one_variable_data_distributions_and_measures_of_center_and_spread",
      "problem_solving_and_data_analysis_two_variable_data_models_and_scatterplots",
    ],
  };

  return questionTypes[subject] || [];
};

/**
 * Chuyển đổi question type text sang code
 * @param {string} text - Text gốc (ví dụ: "Algebra;Linear equations in one variable")
 * @returns {string} Code tương ứng
 */
const convertQuestionTypeTextToCode = (text) => {
  const mapping = {
    // English
    "Craft and Structure;Cross-text connections":
      "craft_and_structure_cross_text_connections",
    "Craft and Structure;Text structure and purpose":
      "craft_and_structure_text_structure_and_purpose",
    "Craft and Structure;Words in context":
      "craft_and_structure_words_in_context",
    "Expression of Ideas;Rhetorical synthesis":
      "expression_of_ideas_rhetorical_synthesis",
    "Expression of Ideas;Transitions": "expression_of_ideas_transitions",
    "Information and Ideas;Central ideas and details":
      "information_and_ideas_central_ideas_and_details",
    "Information and Ideas;Command of evidence":
      "information_and_ideas_command_of_evidence",
    "Information and Ideas;Inferences": "information_and_ideas_inferences",
    "Standard English Conventions;Boundaries":
      "standard_english_conventions_boundaries",
    "Standard English Conventions;Form, Structure, and Sense":
      "standard_english_conventions_form_structure_and_sense",

    // Math
    "Algebra;Linear equations in one variable":
      "algebra_linear_equations_in_one_variable",
    "Algebra;Linear functions": "algebra_linear_functions",
    "Algebra;Linear equations in two variables":
      "algebra_linear_equations_in_two_variables",
    "Algebra;Systems of two linear equations in two variables":
      "algebra_systems_of_two_linear_equations_in_two_variables",
    "Algebra;Linear inequalities in one or two variables":
      "algebra_linear_inequalities_in_one_or_two_variables",
    "Advanced Math;Equivalent expressions":
      "advanced_math_equivalent_expressions",
    "Advanced Math;Nonlinear equations in one variable and systems of equations in two variables":
      "advanced_math_nonlinear_equations_in_one_variable_and_systems_of_equations_in_two_variables",
    "Advanced Math;Nonlinear functions": "advanced_math_nonlinear_functions",
    "Problem-Solving and Data Analysis;Ratios, rates, proportional relationships, and units":
      "problem_solving_and_data_analysis_ratios_rates_proportional_relationships_and_units",
    "Problem-Solving and Data Analysis;Percentages":
      "problem_solving_and_data_analysis_percentages",
    "Problem-Solving and Data Analysis;One-variable data: distributions and measures of center and spread":
      "problem_solving_and_data_analysis_one_variable_data_distributions_and_measures_of_center_and_spread",
    "Problem-Solving and Data Analysis;Two-variable data: models and scatterplots":
      "problem_solving_and_data_analysis_two_variable_data_models_and_scatterplots",
  };

  return mapping[text] || text;
};

/**
 * Chuyển đổi question type code sang text
 * @param {string} code - Code (ví dụ: "algebra_linear_equations_in_one_variable")
 * @returns {string} Text tương ứng
 */
const convertQuestionTypeCodeToText = (code) => {
  const mapping = {
    // English
    craft_and_structure_cross_text_connections:
      "Craft and Structure;Cross-text connections",
    craft_and_structure_text_structure_and_purpose:
      "Craft and Structure;Text structure and purpose",
    craft_and_structure_words_in_context:
      "Craft and Structure;Words in context",
    expression_of_ideas_rhetorical_synthesis:
      "Expression of Ideas;Rhetorical synthesis",
    expression_of_ideas_transitions: "Expression of Ideas;Transitions",
    information_and_ideas_central_ideas_and_details:
      "Information and Ideas;Central ideas and details",
    information_and_ideas_command_of_evidence:
      "Information and Ideas;Command of evidence",
    information_and_ideas_inferences: "Information and Ideas;Inferences",
    standard_english_conventions_boundaries:
      "Standard English Conventions;Boundaries",
    standard_english_conventions_form_structure_and_sense:
      "Standard English Conventions;Form, Structure, and Sense",

    // Math
    algebra_linear_equations_in_one_variable:
      "Algebra;Linear equations in one variable",
    algebra_linear_functions: "Algebra;Linear functions",
    algebra_linear_equations_in_two_variables:
      "Algebra;Linear equations in two variables",
    algebra_systems_of_two_linear_equations_in_two_variables:
      "Algebra;Systems of two linear equations in two variables",
    algebra_linear_inequalities_in_one_or_two_variables:
      "Algebra;Linear inequalities in one or two variables",
    advanced_math_equivalent_expressions:
      "Advanced Math;Equivalent expressions",
    advanced_math_nonlinear_equations_in_one_variable_and_systems_of_equations_in_two_variables:
      "Advanced Math;Nonlinear equations in one variable and systems of equations in two variables",
    advanced_math_nonlinear_functions: "Advanced Math;Nonlinear functions",
    problem_solving_and_data_analysis_ratios_rates_proportional_relationships_and_units:
      "Problem-Solving and Data Analysis;Ratios, rates, proportional relationships, and units",
    problem_solving_and_data_analysis_percentages:
      "Problem-Solving and Data Analysis;Percentages",
    problem_solving_and_data_analysis_one_variable_data_distributions_and_measures_of_center_and_spread:
      "Problem-Solving and Data Analysis;One-variable data: distributions and measures of center and spread",
    problem_solving_and_data_analysis_two_variable_data_models_and_scatterplots:
      "Problem-Solving and Data Analysis;Two-variable data: models and scatterplots",
  };

  return mapping[code] || code;
};

export {
  // CRUD Operations
  createQuestion,
  createMultipleQuestions,
  getQuestions,
  searchQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  deleteMultipleQuestions,

  // Statistics
  getQuestionStats,

  // Exam Generation
  getExamGenerationStats,
  generateFilteredExam,
  generateRandomExam,

  // Helper Functions
  getQuestionTypesBySubject,
  convertQuestionTypeTextToCode,
  convertQuestionTypeCodeToText,
  getAllQuestionsByCategory,
  getAllQuestionsByType,
  getQuestionTypes,
};
