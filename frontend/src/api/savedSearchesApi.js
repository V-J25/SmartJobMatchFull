import { supabase } from './supabaseClient'

export const savedSearchesApi = {
  async getSavedSearches(userId) {
    const { data, error } = await supabase
      .from('saved_searches')
      .select('id, search_query, job_ids, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async saveSearch(userId, searchQuery, jobIds) {
    const query = searchQuery.trim()
    const { data, error } = await supabase
      .from('saved_searches')
      .insert({
        user_id: userId,
        search_query: query,
        job_ids: [...new Set(jobIds.map(String))],
      })
      .select('id, search_query, job_ids, created_at, updated_at')
      .single()

    if (error) {
      if (error.code === '23505') {
        const { data: existing, error: existingError } = await supabase
          .from('saved_searches')
          .select('id, search_query, job_ids, created_at, updated_at')
          .eq('user_id', userId)
          .eq('search_query', query)
          .single()
        if (existingError) throw existingError
        return existing
      }
      throw error
    }

    return data
  },

  async compareAndUpdateResults(savedSearchId, currentJobIds) {
    const { data, error } = await supabase.rpc('compare_saved_search_job_ids', {
      p_saved_search_id: savedSearchId,
      p_current_job_ids: [...new Set(currentJobIds.map(String))],
    })

    if (error) throw error
    return data || []
  },
}
