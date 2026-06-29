import "dotenv/config";
import express from "express";
import authRouter from "./routes/authRoutes.js";

const vpp = express();

// Middleware
vpp.use(express.json());

// CORS Middleware to allow requests from the frontend (localhost:5173 / production domains)
vpp.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-RapidAPI-Key",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Proxy route for JSearch API
vpp.get("/api/jobs", async (req, res) => {
  try {
    const { search, location, type } = req.query;
    const rapidApiKey = process.env.RAPIDAPI_KEY || req.get("x-rapidapi-key");

    if (!rapidApiKey) {
      console.warn("No JSearch RapidAPI key was provided.");
      return res
        .status(400)
        .json({ error: "RapidAPI key is not configured on the server." });
    }

    const queryParts = [];
    if (search) queryParts.push(search);
    if (location && location.toLowerCase() !== "remote")
      queryParts.push(location);

    let query = queryParts.join(" ").trim();
    if (!query) {
      query = "jobs in India";
    }

    const url = new URL("https://jsearch.p.rapidapi.com/search-v2");
    url.searchParams.append("query", query);
    url.searchParams.append("page", "1");
    url.searchParams.append("num_pages", "10");

    if (type) {
      const typeLower = type.toLowerCase();
      if (typeLower.includes("full")) {
        url.searchParams.append("employment_types", "FULLTIME");
      } else if (typeLower.includes("part")) {
        url.searchParams.append("employment_types", "PARTTIME");
      } else if (typeLower.includes("intern")) {
        url.searchParams.append("employment_types", "INTERN");
      } else if (typeLower.includes("contract")) {
        url.searchParams.append("employment_types", "CONTRACTOR");
      }
    }

    if (location && location.toLowerCase() === "remote") {
      url.searchParams.append("remote_jobs_only", "true");
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`JSearch API returned status ${response.status}`);
    }

    const data = await response.json();
    let jobsArray = [];
    if (Array.isArray(data.data)) {
      jobsArray = data.data;
    } else if (data.data && Array.isArray(data.data.jobs)) {
      jobsArray = data.data.jobs;
    }

    const uniqueJobs = Array.from(
      new Map(
        jobsArray.map((job, index) => [
          job.job_id || `missing-${index}`,
          job,
        ]),
      ).values(),
    );

    res.json({ ...data, data: uniqueJobs });
  } catch (error) {
    console.error("Backend jobs proxy error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch jobs from third-party API." });
  }
});

// Mount authentication router
vpp.use("/api/auth", authRouter);

export const app = vpp;
