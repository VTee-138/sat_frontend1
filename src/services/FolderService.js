import { apiClient, del, get, post, put } from "../common/apiClient";

const FolderService = {
  // Lấy danh sách thư mục
  getFolders: async (page = 1, limit = 20) => {
    return await get(`/folder?page=${page}&limit=${limit}`);
  },

  // Lấy thông tin chi tiết thư mục
  getFolderById: async (folderId) => {
    return await get(`/folder/${folderId}`);
  },

  // Tạo thư mục mới
  createFolder: async (folderData) => {
    return await post("/folder", folderData);
  },

  // Cập nhật thư mục
  updateFolder: async (folderId, folderData) => {
    return await put(`/folder/${folderId}`, folderData);
  },

  // Xóa thư mục
  deleteFolder: async (folderId) => {
    return await del(`/folder/${folderId}`);
  },
};

export default FolderService;
