import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// User API
export const userAPI = {
  // 獲取所有用戶
  getAllUsers: async () => {
    const response = await api.get('/users/');
    return response.data;
  },

  // 獲取特定用戶
  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // 創建新用戶
  createUser: async (profileData) => {
    const response = await api.post('/users/', {
      profile_data: profileData
    });
    return response.data;
  },

  // 更新用戶
  updateUser: async (userId, profileData) => {
    const response = await api.put(`/users/${userId}`, {
      profile_data: profileData
    });
    return response.data;
  },
};

// Interview API
export const interviewAPI = {
  // 開始面試
  startInterview: async (userId) => {
    const response = await api.post(`/interview/start/${userId}`);
    return response.data;
  },

  // 發送消息
  sendMessage: async (userId, message, sessionId = null) => {
    const response = await api.post(`/interview/chat/${userId}`, {
      message,
      session_id: sessionId
    });
    return response.data;
  },

  // 獲取對話歷史
  getHistory: async (sessionId) => {
    const response = await api.get(`/interview/session/${sessionId}/history`);
    return response.data;
  },

  // 清除session
  clearSession: async (sessionId) => {
    const response = await api.delete(`/interview/session/${sessionId}`);
    return response.data;
  },
};

export default api;
