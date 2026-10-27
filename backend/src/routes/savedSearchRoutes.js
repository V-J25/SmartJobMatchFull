import express from "express";
import { createClient } from "@supabase/supabase-js";
import { requireAuth } from "../middleware/authMiddleware.js";
import supabase from "../config/supabase.js";

const router = express.Router();

const SEARCH_COLUMNS = "id, search_query, job_ids, created_at, updated_at";

// Client that forwards the caller's JWT so database functions that rely on
// auth.uid() / RLS behave exactly as they did when the browser called them.
const createUserClient = (token) => {
  const url = (process.env.SUPABASE_URL || "")
    .replace(/\/rest\/v1\/?$/, "")
    .trim();
  const key = (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  ).trim();
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
};

const toIdList = (ids) => [...new Set(ids.map(String))];

// GET /api/saved-searches
router.get("/", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("saved_searches")
      .select(SEARCH_COLUMNS)
      .eq("user_id", req.user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error("Error fetching saved searches:", error);
    res.status(500).json({ error: "Failed to fetch saved searches" });
  }
});

// POST /api/saved-searches  body: { search_query, job_ids }
router.post("/", requireAuth, async (req, res) => {
  try {
    const { search_query, job_ids } = req.body;
    const query = typeof search_query === "string" ? search_query.trim() : "";

    if (!query) {
      return res.status(400).json({ error: "search_query is required" });
    }
    if (!Array.isArray(job_ids)) {
      return res.status(400).json({ error: "job_ids must be an array" });
    }

    const { data, error } = await supabase
      .from("saved_searches")
      .insert({
        user_id: req.user.id,
        search_query: query,
        job_ids: toIdList(job_ids),
      })
      .select(SEARCH_COLUMNS)
      .single();

    if (error) {
      // 23505 = already saved -> return the existing row
      if (error.code === "23505") {
        const { data: existing, error: existingError } = await supabase
          .from("saved_searches")
          .select(SEARCH_COLUMNS)
          .eq("user_id", req.user.id)
          .eq("search_query", query)
          .single();

        if (existingError) throw existingError;
        return res.json(existing);
      }
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Error saving search:", error);
    res.status(500).json({ error: "Failed to save search" });
  }
});

// POST /api/saved-searches/:id/compare  body: { current_job_ids }
router.post("/:id/compare", requireAuth, async (req, res) => {
  try {
    const { current_job_ids } = req.body;

    if (!Array.isArray(current_job_ids)) {
      return res
        .status(400)
        .json({ error: "current_job_ids must be an array" });
    }

    // Make sure the saved search belongs to the caller
    const { data: owned, error: ownedError } = await supabase
      .from("saved_searches")
      .select("id")
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (ownedError) throw ownedError;
    if (!owned) {
      return res.status(404).json({ error: "Saved search not found" });
    }

    const params = {
      p_saved_search_id: req.params.id,
      p_current_job_ids: toIdList(current_job_ids),
    };

    const token = req.headers.authorization.split(" ")[1];
    let { data, error } = await createUserClient(token).rpc(
      "compare_saved_search_job_ids",
      params,
    );

    if (error) {
      // Fall back to the server client (ownership was already verified above)
      console.warn(
        "User-scoped RPC failed, retrying with server client:",
        error.message,
      );
      ({ data, error } = await supabase.rpc(
        "compare_saved_search_job_ids",
        params,
      ));
    }

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error("Error comparing saved search:", error);
    res.status(500).json({ error: "Failed to compare saved search" });
  }
});

export default router;
