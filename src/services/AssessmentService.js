import { get, post, del, put } from "../common/apiClient";

const PATH_ASSESSMENT = "/assessment";
const PATH_EXAM_RESULT = "/exam-result";

const createAssessment = async (body) => {
  return await post(PATH_ASSESSMENT, body);
};

const getAssessments = async (pageNumber, limit = 6, searchQuery) => {
  let query = "";
  if (!searchQuery) {
    query = `?page=${pageNumber}&limit=${limit}`;
  } else {
    query = `?page=${pageNumber}&limit=${limit}&q=${searchQuery}`;
  }
  return await get(PATH_ASSESSMENT + query);
};

const deleteAssessment = async (examId) => {
  return await del(PATH_ASSESSMENT + `/${examId}`);
};

const getAssessmentInfoById = async () => {
  return await get(PATH_ASSESSMENT + `/user-info`);
};

const totalAssessments = async () => {
  return await get(PATH_ASSESSMENT + `/total`);
};

// Lấy danh sách bài thi đã hoàn thành
const getCompletedAssessments = async (page = 1, limit = 6) => {
  return await get(
    PATH_EXAM_RESULT + `/completed-assessments?page=${page}&limit=${limit}`
  );
};

// Lấy thông tin completion status cho từng assessment
const getAssessmentCompletionStatus = async () => {
  return await get(PATH_EXAM_RESULT + `/completion-status`);
};

export {
  createAssessment,
  getAssessments,
  deleteAssessment,
  getAssessmentInfoById,
  totalAssessments,
  getCompletedAssessments,
  getAssessmentCompletionStatus,
};
