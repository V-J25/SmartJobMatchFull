import { supabase } from './supabaseClient'

export const profileApi = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  },

  async updateProfile(userId, fullName, skills) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        skills: skills || [],
      })
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
