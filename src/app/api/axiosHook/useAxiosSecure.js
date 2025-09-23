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

    // LocalStorage token (custom JWT)
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token')
    }

    // if localStorage don't have then NextAuth sesstion will take
    if (!token) {
      const session = await getSession()
      if (session?.accessToken) {
        token = session.accessToken
      }
    }

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
      //write here future refresh token logic
    }
    return Promise.reject(error)
  }
)

export default axiosSecure
