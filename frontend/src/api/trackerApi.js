import { backendRequest } from "./apiClient";

// The backend identifies the user from the access token, so userId is not sent.
export const trackerApi = {
  async getTracker() {
    // Backend creates an empty tracker record if none exists yet
    return await backendRequest("/api/tracker");
  },

  async updateTracker(_userId, trackerData) {
    return await backendRequest("/api/tracker", {
      method: "PUT",
      body: {
        applied: trackerData.applied || [],
        interview: trackerData.interview || [],
        offer: trackerData.offer || [],
        rejected: trackerData.rejected || [],
      },
    });
  },
};
