import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import supabase from "../config/supabase.js";

const router = express.Router();

const asArray = (value) => (Array.isArray(value) ? value : []);

// GET /api/tracker -> current user's tracker row (created if missing)
router.get("/", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("job_tracker")
      .select("*")
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (error) throw error;
    if (data) return res.json(data);

    const { data: created, error: createError } = await supabase
      .from("job_tracker")
      .insert({
        user_id: req.user.id,
        applied: [],
        interview: [],
        offer: [],
        rejected: [],
      })
      .select()
      .single();

    if (createError) throw createError;
    res.json(created);
  } catch (error) {
    console.error("Error fetching tracker:", error);
    res.status(500).json({ error: "Failed to fetch tracker" });
  }
});

// PUT /api/tracker  body: { applied, interview, offer, rejected }
router.put("/", requireAuth, async (req, res) => {
  try {
    const { applied, interview, offer, rejected } = req.body;

    const { data, error } = await supabase
      .from("job_tracker")
      .update({
        applied: asArray(applied),
        interview: asArray(interview),
        offer: asArray(offer),
        rejected: asArray(rejected),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Tracker not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error updating tracker:", error);
    res.status(500).json({ error: "Failed to update tracker" });
  }
});

export default router;
