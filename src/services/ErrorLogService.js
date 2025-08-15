import { apiClient, del, get, patch, post, put } from "../common/apiClient";

const ErrorLogService = {
  // Lấy danh sách câu hỏi
  getErrorLogs: async (
    page = 1,
    limit = 20,
    folderId = null,
    search = null
  ) => {
    try {
      let url = `/error-log?page=${page}&limit=${limit}`;
      if (folderId) url += `&folderId=${folderId}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      return await get(url);
    } catch (error) {
      throw error;
    }
  },

  // Lấy câu hỏi theo thư mục
  getErrorLogsByFolder: async (
    folderId,
    page = 1,
    limit = 20,
    search = null
  ) => {
    let url = `/error-log/folder/${folderId}?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    return await get(url);
  },

  // Lấy thông tin chi tiết câu hỏi
  getErrorLogById: async (errorLogId) => {
    return await get(`/error-log/${errorLogId}`);
  },

  // Tạo câu hỏi mới
  createErrorLog: async (errorLogData) => {
    return await post("/error-log", errorLogData);
  },

  // Cập nhật câu hỏi
  updateErrorLog: async (errorLogId, errorLogData) => {
    return await put(`/error-log/${errorLogId}`, errorLogData);
  },

  // Xóa câu hỏi
  deleteErrorLog: async (errorLogId) => {
    return await del(`/error-log/${errorLogId}`);
  },

  // Cập nhật trạng thái câu hỏi
  updateErrorLogStatus: async (errorLogId, status) => {
    return await patch(`/error-log/${errorLogId}/status`, { status });
  },
};

export default ErrorLogService;
