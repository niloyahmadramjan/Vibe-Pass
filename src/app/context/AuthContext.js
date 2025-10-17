'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import axiosSecure from '../api/axiosHook/useAxiosSecure'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    // ✅ Case 1: NextAuth social login
    if (session?.user) {
      axiosSecure
        .get('/api/user/info') // backend theke fresh data
        .then((res) => {
          setUser(res.data)
        })
        .catch(() => {
          logout()
        })
        .finally(() => setLoading(false))
    } else {
      // ✅ Case 2: Custom JWT login
      const token = localStorage.getItem('token')
      if (token) {
        axiosSecure
          .get('/api/user/info') // backend theke fresh data
          .then((res) => {
            setUser(res.data)
          })
          .catch(() => {
            logout()
          })
          .finally(() => setLoading(false))
      } else {
        setUser(null)
        setLoading(false)
      }
    }
  }, [session, status])

  // ✅ Login function (save token + fetch fresh user)
  const login = async (data) => {
    localStorage.setItem('token', data.token)
    try {
      const res = await axiosSecure.get('/api/user/info')
      setUser(res.data)
    } catch (error) {
      console.error('Failed to fetch user after login:', error)
      setUser(null) 
    }
  }

  // ✅ Logout function (clear everything)
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    signOut({ redirect: false }) // clears NextAuth too
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading,setLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
