import { supabase } from './supabaseClient'

export const authApi = {
  async signup(email, password, fullName, role = 'seeker') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    })
    if (error) throw error
    
    // Ensure the profile role is updated since DB triggers may default to 'seeker'
    if (data?.user?.id) {
      await supabase
        .from('profiles')
        .update({ role: role })
        .eq('id', data.user.id)
    }
    
    return data
  },


  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    
    // Auto-sync role on login to fix any DB default mismatched roles
    if (data?.user?.id && data.user.user_metadata?.role) {
      await supabase
        .from('profiles')
        .update({ role: data.user.user_metadata.role })
        .eq('id', data.user.id)
    }
    
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

  async getUserRole(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    if (error) return 'seeker' // fallback
    return data.role
  },


  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },

  async forgotPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error
    return data
  },

  async resetPassword(password) {
    const { data, error } = await supabase.auth.updateUser({
      password,
    })

    if (error) throw error
    return data
  },
}
