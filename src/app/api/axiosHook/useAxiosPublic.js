import axios from 'axios'

const axiosPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosPublic.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('Public API Error:', err.response?.data || err.message)
    return Promise.reject(err)
  }
)

export default axiosPublic 
