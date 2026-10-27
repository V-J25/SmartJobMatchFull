import { backendRequest } from "./apiClient";

// The backend identifies the user from the access token, so userId is not sent.
export const savedSearchesApi = {
  async getSavedSearches() {
    const data = await backendRequest("/api/saved-searches");
    return data || [];
  },

  async saveSearch(_userId, searchQuery, jobIds) {
    return await backendRequest("/api/saved-searches", {
      method: "POST",
      body: {
        search_query: searchQuery.trim(),
        job_ids: [...new Set(jobIds.map(String))],
      },
    });
  },

  async compareAndUpdateResults(savedSearchId, currentJobIds) {
    const data = await backendRequest(
      `/api/saved-searches/${encodeURIComponent(savedSearchId)}/compare`,
      {
        method: "POST",
        body: {
          current_job_ids: [...new Set(currentJobIds.map(String))],
        },
      },
    );
    return data || [];
  },
};
