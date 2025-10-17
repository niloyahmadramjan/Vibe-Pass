import axios from 'axios'
import { getSession } from 'next-auth/react'

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosSecure.interceptors.request.use(
  async (config) => {
    let token = null

    // First try localStorage JWT
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token')
    }

    // If not found, fallback to NextAuth session token
    if (!token) {
     const session = await getSession()
    //  console.log(session.accessToken) 
      if (session?.accessToken) {
        token = session.accessToken
      }
    }

    // Attach final token
    if (token) { 
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Maybe token expired.')
      // TODO: refresh token logic here
    }
    return Promise.reject(error)
  }
)

export default axiosSecure