import express from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import supabase from '../config/supabase.js';
import { jobApiLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// GET all active platform jobs (for seekers)
router.get('/', jobApiLimiter, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies (
          name,
          logo_url
        )
      `)
      .ilike('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET recruiter's jobs
router.get('/my', requireAuth, requireRole('recruiter'), async (req, res) => {
  try {
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('recruiter_id', req.user.id)
      .single();

    if (!company) {
      return res.json([]);
    }

    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        applications:applications(count)
      `)
      .eq('company_id', company.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// POST create job
router.post('/', requireAuth, requireRole('recruiter'), async (req, res) => {
  try {
    const { title, description, requirements, location, job_type, salary_range } = req.body;

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('recruiter_id', req.user.id)
      .single();

    if (companyError || !company) {
      return res.status(400).json({ error: 'Please create a company profile first' });
    }

    let workMode = 'On-site';
    if (location && location.toLowerCase().includes('remote')) {
      workMode = 'Remote';
    } else if (location && location.toLowerCase().includes('hybrid')) {
      workMode = 'Hybrid';
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        recruiter_id: req.user.id,
        company_id: company.id,
        title,
        description,
        requirements: requirements ? [requirements] : [],
        location,
        employment_type: job_type || 'Full Time',
        work_mode: workMode,
        salary_range
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// PUT update job status (e.g., active -> closed)
router.put('/:id', requireAuth, requireRole('recruiter'), async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate that the recruiter owns this job
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('recruiter_id', req.user.id)
      .single();

    if (!company) return res.status(403).json({ error: 'Forbidden' });

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .update({ status })
      .eq('id', req.params.id)
      .eq('company_id', company.id)
      .select()
      .single();

    if (jobError) throw jobError;
    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// DELETE job
router.delete('/:id', requireAuth, requireRole('recruiter'), async (req, res) => {
  try {
    // Validate that the recruiter owns this job
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('recruiter_id', req.user.id)
      .single();

    if (!company) return res.status(403).json({ error: 'Forbidden' });

    const { error: jobError } = await supabase
      .from('jobs')
      .delete()
      .eq('id', req.params.id)
      .eq('company_id', company.id);

    if (jobError) throw jobError;
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// POST apply for job
router.post('/:id/apply', requireAuth, requireRole('seeker'), async (req, res) => {
  try {
    const { resume_url, cover_letter } = req.body;
    const jobId = req.params.id;

    // Check if already applied
    const { data: existingApp } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('user_id', req.user.id)
      .single();

    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([{
        job_id: jobId,
        user_id: req.user.id,
        name: req.body.name || req.user.user_metadata?.full_name || 'Applicant',
        email: req.body.email || req.user.email,
        resume_url,
        cover_letter
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Application submitted successfully', application: data });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// GET job applicants
router.get('/:id/applicants', requireAuth, requireRole('recruiter'), async (req, res) => {
  try {
    // Verify ownership
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('recruiter_id', req.user.id)
      .single();

    if (!company) return res.status(403).json({ error: 'Forbidden' });

    const { data: jobCheck } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', req.params.id)
      .eq('company_id', company.id)
      .single();

    if (!jobCheck) return res.status(403).json({ error: 'Forbidden' });

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('job_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
});

export default router;
