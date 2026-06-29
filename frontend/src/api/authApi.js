import { supabase } from './supabaseClient'

export const authApi = {
  async signup(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (error) throw error
    return data
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },

  async forgotPassword(email) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
    const response = await fetch(`${backendUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Failed to request password reset')
    }
    return data
  },

  async verifyResetToken(token) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
    const response = await fetch(`${backendUrl}/api/auth/verify-token?token=${encodeURIComponent(token)}`)
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Invalid or expired reset token')
    }
    return data
  },

  async resetPassword(token, password) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
    const response = await fetch(`${backendUrl}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Failed to reset password')
    }
    return data
  },
}
