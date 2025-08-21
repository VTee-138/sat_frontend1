import { apiClient, del, get, patch, post, put } from "../common/apiClient";

const VocabularyService = {
  // Lấy danh sách từ vựng
  getVocabularies: async (
    page = 1,
    limit = 20,
    folderId = null,
    search = null
  ) => {
    try {
      let url = `/vocabulary?page=${page}&limit=all`;
      if (folderId) url += `&folderId=${folderId}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      return await get(url);
    } catch (error) {
      throw error;
    }
  },

  // Lấy từ vựng theo thư mục
  getVocabulariesByFolder: async (
    folderId,
    page = 1,
    limit = 20,
    search = null
  ) => {
    let url = `/vocabulary/folder/${folderId}?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    return await get(url);
  },

  // Lấy thông tin chi tiết từ vựng
  getVocabularyById: async (vocabularyId) => {
    return await get(`/vocabulary/${vocabularyId}`);
  },

  // Tạo từ vựng mới
  createVocabulary: async (vocabularyData) => {
    return await post("/vocabulary", vocabularyData);
  },

  // Cập nhật từ vựng
  updateVocabulary: async (vocabularyId, vocabularyData) => {
    return await put(`/vocabulary/${vocabularyId}`, vocabularyData);
  },

  // Xóa từ vựng
  deleteVocabulary: async (vocabularyId) => {
    return await del(`/vocabulary/${vocabularyId}`);
  },

  // Cập nhật trạng thái từ vựng
  updateVocabularyStatus: async (vocabularyId, status) => {
    return await patch(`/vocabulary/${vocabularyId}/status`, { status });
  },
};

export default VocabularyService;
