import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import supabase from "../config/supabase.js";

const router = express.Router();

const ALLOWED_ROLES = ["seeker", "recruiter"];

// GET /api/auth/role -> { role }
router.get("/role", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", req.user.id)
      .single();

    if (error || !data) {
      return res.json({ role: "seeker" });
    }

    res.json({ role: data.role });
  } catch (error) {
    console.error("Error fetching role:", error);
    res.status(500).json({ error: "Failed to fetch role" });
  }
});

// POST /api/auth/sync-role
// Copies the role stored in the user's auth metadata into the profiles table
// (DB triggers may default new profiles to 'seeker').
router.post("/sync-role", requireAuth, async (req, res) => {
  try {
    const role = req.user.user_metadata?.role;

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: "Invalid or missing role" });
    }

    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", req.user.id);

    if (error) throw error;
    res.json({ role });
  } catch (error) {
    console.error("Error syncing role:", error);
    res.status(500).json({ error: "Failed to sync role" });
  }
});

export default router;
