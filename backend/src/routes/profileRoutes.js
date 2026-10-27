import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import supabase from "../config/supabase.js";

const router = express.Router();

// GET /api/profile -> current user's profile row
router.get("/", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Profile not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /api/profile  body: { full_name, skills }
router.put("/", requireAuth, async (req, res) => {
  try {
    const { full_name, skills } = req.body;

    if (typeof full_name !== "string") {
      return res.status(400).json({ error: "full_name must be a string" });
    }
    if (skills !== undefined && skills !== null) {
      if (
        !Array.isArray(skills) ||
        !skills.every((s) => typeof s === "string")
      ) {
        return res
          .status(400)
          .json({ error: "skills must be an array of strings" });
      }
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name,
        skills: skills || [],
      })
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
