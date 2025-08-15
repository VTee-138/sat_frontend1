import { get, post } from "../common/apiClient";

const PATH_EXAM = "/exam";
const getExam = async () => {
  return await get(PATH_EXAM);
};
const getExamDetail = async (id) => {
  return await get(PATH_EXAM + `/${id}`);
};
const getExamTrend = async () => {
  return await get(PATH_EXAM + "/top-trending");
};
const getPost = async (pageNumber, type = "", limit = 9) => {
  return await get(
    PATH_EXAM + `/categories?page=${pageNumber}&limit=${limit}&type=${type}`
  );
};

const getSearch = async () => {
  return await get(PATH_EXAM + "/exam-idtitle");
};

const getExamByAssessmentId = async (pageNumber, type = "", limit = 6, id) => {
  return await get(
    PATH_EXAM +
      `/by-assessmentId/${id}?page=${pageNumber}&limit=${limit}&type=${type}`
  );
};

export {
  getExam,
  getExamTrend,
  getPost,
  getSearch,
  getExamDetail,
  getExamByAssessmentId,
};
