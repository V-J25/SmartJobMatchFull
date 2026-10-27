import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import supabase from "../config/supabase.js";

const router = express.Router();

// GET /api/saved-jobs -> rows from saved_jobs for the current user
router.get("/", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("saved_jobs")
      .select("*")
      .eq("user_id", req.user.id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res.status(500).json({ error: "Failed to fetch saved jobs" });
  }
});

// POST /api/saved-jobs  body: { id, title, company, location, apply_url }
router.post("/", requireAuth, async (req, res) => {
  try {
    const { id, title, company, location, apply_url } = req.body;

    if (id === undefined || id === null || String(id).trim() === "") {
      return res.status(400).json({ error: "Job id is required" });
    }

    const { data, error } = await supabase
      .from("saved_jobs")
      .insert({
        user_id: req.user.id,
        job_id: String(id),
        title,
        company,
        location: location || "",
        apply_url: apply_url || "",
      })
      .select()
      .single();

    if (error) {
      // 23505 = PostgreSQL unique violation (job already saved)
      if (error.code === "23505") {
        return res
          .status(409)
          .json({ error: "Job already saved", code: "DUPLICATE" });
      }
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ error: "Failed to save job" });
  }
});

// DELETE /api/saved-jobs?job_id=<id>
router.delete("/", requireAuth, async (req, res) => {
  try {
    const jobId = req.query.job_id;

    if (!jobId || typeof jobId !== "string") {
      return res
        .status(400)
        .json({ error: "job_id query parameter is required" });
    }

    const { error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("user_id", req.user.id)
      .eq("job_id", jobId);

    if (error) throw error;
    res.json({ message: "Saved job removed" });
  } catch (error) {
    console.error("Error removing saved job:", error);
    res.status(500).json({ error: "Failed to remove saved job" });
  }
});

export default router;
