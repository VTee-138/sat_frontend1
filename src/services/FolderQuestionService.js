import { del, get, post, put } from "../common/apiClient";

const FolderQuestionService = {
  // Lấy danh sách thư mục câu hỏi
  getFolderQuestions: async (page = 1, limit = 20) => {
    return await get(`/folder-question?page=${page}&limit=all`);
  },

  // Lấy thông tin chi tiết thư mục câu hỏi
  getFolderQuestionById: async (folderId) => {
    return await get(`/folder-question/${folderId}`);
  },

  // Tạo thư mục câu hỏi mới
  createFolderQuestion: async (folderData) => {
    return await post("/folder-question", folderData);
  },

  // Cập nhật thư mục câu hỏi
  updateFolderQuestion: async (folderId, folderData) => {
    return await put(`/folder-question/${folderId}`, folderData);
  },

  // Xóa thư mục câu hỏi
  deleteFolderQuestion: async (folderId) => {
    return await del(`/folder-question/${folderId}`);
  },
};

export default FolderQuestionService;
