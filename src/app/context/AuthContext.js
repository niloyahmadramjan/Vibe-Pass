'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const { data: session } = useSession() // NextAuth session
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Case 1: If logged in with social login (NextAuth)
    if (session?.user) {
      setUser({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        provider: 'social',
      })
    } else {
      // Case 2: If logged in with custom JWT
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }
  }, [session])

  const login = (data) => {
    // Save JWT token login user
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
