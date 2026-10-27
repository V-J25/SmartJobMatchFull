import { backendRequest } from "./apiClient";

// The backend identifies the user from the access token, so userId is not sent.
export const savedJobsApi = {
  async getSavedJobs() {
    const data = await backendRequest("/api/saved-jobs");

    // Map database model to frontend UI expected format
    return data.map((dbJob) => ({
      id: dbJob.job_id,
      title: dbJob.title,
      company: dbJob.company,
      location: dbJob.location,
      apply_url: dbJob.apply_url || "",
    }));
  },

  async saveJob(_userId, job) {
    try {
      return await backendRequest("/api/saved-jobs", {
        method: "POST",
        body: {
          id: job.id.toString(),
          title: job.title,
          company: job.company,
          location: job.location || "",
          apply_url: job.apply_url || job.applyUrl || "",
        },
      });
    } catch (error) {
      // 409 = already saved (prevent duplicate saves)
      if (error.status === 409) {
        return null;
      }
      throw error;
    }
  },

  async removeSavedJob(_userId, jobId) {
    await backendRequest("/api/saved-jobs", {
      method: "DELETE",
      query: { job_id: jobId.toString() },
    });
  },
};
