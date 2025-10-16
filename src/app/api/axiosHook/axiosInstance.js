// axiosInstance.js
import axios from 'axios'

// ✅ Normal Axios instance (no auth, no interceptors)
const useAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // তোমার backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
})

export default useAxios;