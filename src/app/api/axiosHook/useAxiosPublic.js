import axios from 'axios'

const axiosPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: basic error handler
axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Public API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default axiosPublic
