import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitnessDesk_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fitnessDesk_token');
      localStorage.removeItem('fitnessDesk_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  adminUpdateUser: (id, data) => api.put(`/users/admin/user/${id}`, data),
};



// Member services
export const memberService = {
  getAll: () => api.get('/members'),
  getById: (id) => api.get(`/members/${id}`),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
};

// Class services
export const classService = {
  getAll: () => api.get('/classes'),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  enroll: (classId, memberId) => api.post(`/classes/${classId}/enroll`, { memberId }),
};

// Trainer services
export const trainerService = {
  getAll: () => api.get('/trainers'),
  getById: (id) => api.get(`/trainers/${id}`),
  getSchedule: (id) => api.get(`/trainers/${id}/schedule`),
  getMembers: () => api.get('/users/trainer/members'),
};


// Workout services
export const workoutService = {
  getPlans: () => api.get('/workouts'),
  getPlanById: (id) => api.get(`/workouts/${id}`),
  createPlan: (data) => api.post('/workouts', data),
};

// Payment services
export const paymentService = {
  getAll: () => api.get('/payments'),
  getMyPayments: () => api.get('/payments/my-payments'),
  createCheckout: (data) => api.post('/payments/checkout', data),
  getSubscriptions: () => api.get('/payments/subscriptions'),
};


// Attendance services
export const attendanceService = {
  getAll: (date, memberId) => api.get('/attendance', { params: { date, memberId } }),
  getMyAttendance: () => api.get('/attendance/my-attendance'),
  checkIn: (data) => api.post('/attendance/check-in', data),
  checkOut: (data) => api.post('/attendance/check-out', data),
};


export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export default api;


export const reviewService = {
  getAll: () => api.get('/testimonials'),
  createReview: (reviewData) => api.post('/testimonials', reviewData)
};
