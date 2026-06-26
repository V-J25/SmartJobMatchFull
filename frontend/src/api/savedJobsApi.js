import { supabase } from './supabaseClient'

export const savedJobsApi = {
  async getSavedJobs(userId) {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('*')
      .eq('user_id', userId)
    if (error) throw error
    
    // Map database model to frontend UI expected format
    return data.map((dbJob) => ({
      id: dbJob.job_id,
      title: dbJob.title,
      company: dbJob.company,
      location: dbJob.location,
      apply_url: dbJob.apply_url || '',
    }))
  },

  async saveJob(userId, job) {
    const { data, error } = await supabase
      .from('saved_jobs')
      .insert({
        user_id: userId,
        job_id: job.id.toString(),
        title: job.title,
        company: job.company,
        location: job.location || '',
        apply_url: job.apply_url || job.applyUrl || '',
      })
      .select()
    
    if (error) {
      // 23505 is PostgreSQL unique key violation (prevent duplicate saves)
      if (error.code === '23505') {
        return null
      }
      throw error
    }
    return data[0]
  },

  async removeSavedJob(userId, jobId) {
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', userId)
      .eq('job_id', jobId.toString())
    if (error) throw error
  },
}
