SmartJobMatch
SmartJobMatch is a full-stack job search and recruitment platform. Job seekers can explore job listings, save opportunities, receive skill-based recommendations, and keep track of their applications. Recruiters can create a company profile, publish jobs, manage postings, and review applicants.
Live demo: smart-job-match-full.vercel.app
Repository: V-J25/SmartJobMatchFull
The Problem
Job seekers often find opportunities across different sources and can lose track of jobs they want to apply for or have already applied to. Recruiters also need a way to publish openings and review applications.
SmartJobMatch brings job discovery, saved jobs, basic skill-based recommendations, application tracking, and recruiter job management into one place. It is a learning project and is not intended to replace established job platforms.
Features
For job seekers
- Sign up, log in, log out, and use password-recovery flows.
- Browse external job listings retrieved through the JSearch API via RapidAPI.
- Browse jobs posted by recruiters on the SmartJobMatch platform.
- Search and filter listings by search term, location, employment type, skills, and experience level.
- Open job details and follow external application links where available.
- Save and remove jobs.
- Save searches and compare the job IDs returned by a later search.
- Track applications across Applied, Interview, Offer, and Rejected statuses.
- View job recommendations based on overlap between profile skills and job skills.
- Update a profile name and skills.
For recruiters
- Create and update a company profile.
- Publish jobs after creating a company profile.
- View and manage their job postings.
- Change a job's status or delete a posting.
- Review applicants for jobs belonging to their company.
Tech Stack
Area	Technologies
Frontend	React, Vite, React Router, Tailwind CSS
Backend	Node.js, Express.js
Authentication	Supabase Auth
Database	Supabase (PostgreSQL)
External job listings	JSearch API through RapidAPI
Request protection	Express rate limiting and backend authentication/role middleware


How It Works
Browser
  |
  v
React + React Router
  |
  +---- Supabase Auth / selected user-data operations
  |       Profiles, saved jobs, saved searches, job tracker
  |
  +---- Express API
          |
          +---- Supabase database
          |       Platform jobs, companies, applications
          |
          +---- JSearch API (through RapidAPI)
                  External job listings
The frontend and backend have separate responsibilities:
- React frontend: renders pages, handles navigation and forms, manages shared state through React Context, and displays job data.
- Supabase: handles authentication and persistent data. Some user-specific data operations are made directly from the browser, so database Row Level Security (RLS) policies are important.
- Express backend: exposes platform job and company endpoints, verifies access tokens on protected endpoints, checks roles, and proxies external job searches to JSearch.
- Recommendation logic: compares the skills listed on a user's profile with the skills associated with a job. It is rule-based skill matching, not an LLM or embedding-based model.
Project Structure
SmartJobMatchFull/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── supabase.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   └── rateLimitMiddleware.js
│       └── routes/
│           ├── authRoutes.js
│           ├── companyRoutes.js
│           └── jobRoutes.js
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── routes/
        ├── pages/
        │   └── recruiter/
        ├── components/
        ├── context/
        ├── api/
        ├── hooks/
        ├── utils/
        └── data/
Getting Started
Prerequisites
- Node.js and npm (use a Node.js version supported by the installed Vite version).
- A Supabase project.
- A RapidAPI account with access to the JSearch API if you want to fetch external job listings.
1. Clone the repository
git clone https://github.com/V-J25/SmartJobMatchFull.git
cd SmartJobMatchFull
2. Configure the backend
Install backend dependencies:
cd backend
npm install
Create backend/.env:
PORT=3000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SECRET_KEY=YOUR_SERVER_SIDE_SUPABASE_SECRET_KEY
RAPIDAPI_KEY=YOUR_RAPIDAPI_KEY
SUPABASE_SECRET_KEY is used by the backend when supplied. The backend code can fall back to SUPABASE_ANON_KEY, but whichever key is used must have the permissions needed by the application. Never put a Supabase secret/service-role key in the frontend, commit it to Git, or share it publicly. A secret/service-role key can bypass database RLS, so protected backend operations must enforce authorization correctly.
Start the backend:
npm start
By default, the server listens on http://localhost:3000.
3. Configure the frontend
Open a second terminal:
cd frontend
npm install
Create frontend/.env:
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
VITE_BACKEND_URL=http://localhost:3000
The frontend uses the Supabase URL and public/anonymous key for browser authentication and direct database operations. Configure suitable RLS policies in Supabase before using real user data.
Then start the development server:
npm run dev
Vite will print the local URL, usually http://localhost:5173.
4. Configure CORS for local development
The current backend CORS code in backend/src/app.js allows the production frontend origin https://smart-job-match-full.vercel.app. For local development, update it to allow http://localhost:5173 as well, ideally using an explicit environment-based allowlist. Otherwise, browser requests from the local frontend may be blocked by CORS.
5. Configure Supabase database tables
The application expects the following Supabase tables and related relationships/columns to be configured:
- profiles
- saved_jobs
- saved_searches
- job_tracker
- companies
- jobs
- applications
Saved-search comparison also calls the database function compare_saved_search_job_ids through Supabase RPC. The repository does not include a database migration/schema file, so create the required tables, relationships, function, and Row Level Security policies in your Supabase project before testing all features. Match the columns and relationships to the queries in frontend/src/api/ and backend/src/routes/.
Available Backend Endpoints
Method	Endpoint	Purpose	Access
GET	/api/external-jobs	Fetch external listings through JSearch	Public, rate-limited
GET	/api/jobs	Fetch active platform jobs	Public, rate-limited
GET	/api/jobs/my	Fetch jobs belonging to the current recruiter's company	Recruiter
POST	/api/jobs	Create a job posting	Recruiter
PUT	/api/jobs/:id	Update a job's status	Recruiter / owner
DELETE	/api/jobs/:id	Delete a job posting	Recruiter / owner
POST	/api/jobs/:id/apply	Submit an application to a platform job	Seeker
GET	/api/jobs/:id/applicants	Fetch applicants for a recruiter's job	Recruiter / owner
GET	/api/companies/my	Fetch the current recruiter's company	Recruiter
POST	/api/companies	Create or update a company profile	Recruiter


Protected backend requests expect a Supabase access token in the Authorization header as a bearer token.
Recommendation Logic
Recommendations are generated by comparing a user's profile skills with the skills associated with each job. The current score is calculated as:
Match score = (Number of matched job skills / Total job skills) * 100
The app ranks jobs by this score and displays the highest-scoring results. Since this is based on skill-name overlap, it may not recognize synonyms or understand context the way a semantic matching model could.
Scripts
Frontend (frontend/)
Command	Description
npm run dev	Start the Vite development server
npm run build	Create a production build
npm run preview	Preview the production build locally
npm run lint	Run ESLint


Backend (backend/)
Command	Description
npm start	Start the Express server


Security Notes
- Keep all secret API keys and Supabase secret/service-role keys on the server and out of source control.
- The frontend's VITE_* variables are bundled into browser-accessible code; do not use them for private secrets.
- Set up and test RLS policies for every table accessed directly from the frontend.
- Treat frontend route guards as a user-experience feature, not a security boundary. Enforce authentication, roles, and resource ownership on the backend as well.
- Before production use, review role assignment and ensure authorization uses trusted server-controlled role data rather than user-editable metadata.
Current Scope and Future Improvements
The current version focuses on job discovery, saved searches, skill-overlap recommendations, application tracking, and basic recruiter workflows. Possible future improvements include resume parsing, semantic job matching, skill-gap analysis, application reminders, and more automated testing. These are potential extensions, not claims about current functionality.
Contributing
Issues and pull requests are welcome. For a change, create a feature branch, test the frontend and backend flows affected by the change, and open a pull request with a clear description.
Author
Developed by V-J25.
