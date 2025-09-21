import axios from 'axios'

// Main Axios instance
const useAxiosSecure = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add interceptor to attach token automatically
useAxiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor (optional: for refresh token later)
useAxiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Maybe token expired.')
      // later: handle refresh token
    }
    return Promise.reject(error)
  }
)

export default useAxiosSecure
