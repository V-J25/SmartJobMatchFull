import { supabase } from './supabaseClient'

export const trackerApi = {
  async getTracker(userId) {
    const { data, error } = await supabase
      .from('job_tracker')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      // If no tracker record exists, create one dynamically
      if (error.code === 'PGRST116') {
        const { data: newTracker, error: createError } = await supabase
          .from('job_tracker')
          .insert({
            user_id: userId,
            applied: [],
            interview: [],
            offer: [],
            rejected: [],
          })
          .select()
          .single()
        if (createError) throw createError
        return newTracker
      }
      throw error
    }
    return data
  },

  async updateTracker(userId, trackerData) {
    const { data, error } = await supabase
      .from('job_tracker')
      .update({
        applied: trackerData.applied || [],
        interview: trackerData.interview || [],
        offer: trackerData.offer || [],
        rejected: trackerData.rejected || [],
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
