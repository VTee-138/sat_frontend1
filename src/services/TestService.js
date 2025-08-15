import { get, post } from "../common/apiClient";

const PATH_TEST = "/exam-result";
const postTest = async (id, body) => {
  return await post(PATH_TEST + `/submit-test/${id}`, body);
};
const getResultById = async (id, assessmentId) => {
  return await get(PATH_TEST + `/${id}/${assessmentId}`);
};
const getResultAll = async (id, assessmentId) => {
  return await get(PATH_TEST + `?examId=${id}&assessmentId=${assessmentId}`);
};
// /exam-result/check-correct-answers/:examId
const getResultHistory = async (id, assessmentId) => {
  return await get(PATH_TEST + `/check-correct-answers/${id}/${assessmentId}`);
};
// /exam-result/cached-score/:assessmentId
const getCachedScore = async (assessmentId) => {
  return await get(`/exam-result/cached-score/${assessmentId}`);
};

const getExamResult = async (assessmentId) => {
  return await get(`/exam-result/result-detail/${assessmentId}`);
};

export {
  postTest,
  getResultById,
  getResultAll,
  getResultHistory,
  getCachedScore,
  getExamResult,
};
