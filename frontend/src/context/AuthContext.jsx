import { useState, useEffect } from 'react'
import { AuthContext } from './authContextValue'
import { authApi } from '../api/authApi'
import { profileApi } from '../api/profileApi'

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (sessionUser) => {
    try {
      const profile = await profileApi.getProfile(sessionUser.id)
      return {
        id: sessionUser.id,
        email: sessionUser.email,
        name: profile?.full_name || sessionUser.user_metadata?.full_name || 'Student',
        skills: profile?.skills || [],
      }
    } catch (err) {
      console.error('Error fetching user profile from database:', err)
      return {
        id: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.user_metadata?.full_name || 'Student',
        skills: [],
      }
    }
  }

  useEffect(() => {
    let active = true

    // Check active session on mount
    authApi.getSession().then(async (session) => {
      if (active) {
        if (session?.user) {
          const profileData = await fetchProfile(session.user)
          if (active) {
            setUser(profileData)
            setLoading(false)
          }
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    }).catch((err) => {
      console.error('Error fetching active session:', err)
      if (active) {
        setLoading(false)
      }
    })

    // Listen for auth state changes
    const { data: { subscription } } = authApi.onAuthStateChange(async (event, session) => {
      if (active) {
        if (session?.user) {
          const profileData = await fetchProfile(session.user)
          if (active) {
            setUser(profileData)
            setLoading(false)
          }
        } else {
          setUser(null)
        }
      }
    })

    return () => {
      active = false
      subscription?.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    return await authApi.login(email, password)
  }

  const signup = async (email, password, fullName) => {
    return await authApi.signup(email, password, fullName)
  }

  const logout = async () => {
    await authApi.logout()
  }

  const updateProfile = async (fullName, skills) => {
    if (!user) return
    await profileApi.updateProfile(user.id, fullName, skills)
    setUser((prev) => (prev ? { ...prev, name: fullName, skills } : null))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
