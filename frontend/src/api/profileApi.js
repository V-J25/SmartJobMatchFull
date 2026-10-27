import { backendRequest } from "./apiClient";

// The backend identifies the user from the access token, so userId is not sent.
export const profileApi = {
  async getProfile() {
    return await backendRequest("/api/profile");
  },

  async updateProfile(_userId, fullName, skills) {
    return await backendRequest("/api/profile", {
      method: "PUT",
      body: {
        full_name: fullName,
        skills: skills || [],
      },
    });
  },
};
