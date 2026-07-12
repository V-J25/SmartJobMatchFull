import express from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import supabase from '../config/supabase.js';

const router = express.Router();

// Get recruiter's company
router.get('/my', requireAuth, requireRole('recruiter'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('recruiter_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is not found
      throw error;
    }

    res.json(data || null);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Create or update company
router.post('/', requireAuth, requireRole('recruiter'), async (req, res) => {
  try {
    const { name, website, description, logo_url } = req.body;

    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('recruiter_id', req.user.id)
      .single();

    let result;
    
    if (existingCompany) {
      result = await supabase
        .from('companies')
        .update({ name, website, description, logo_url })
        .eq('id', existingCompany.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('companies')
        .insert([{ 
          recruiter_id: req.user.id, 
          name, 
          website, 
          description, 
          logo_url 
        }])
        .select()
        .single();
    }

    if (result.error) throw result.error;
    res.json(result.data);
  } catch (error) {
    console.error('Error saving company:', error);
    res.status(500).json({ error: 'Failed to save company' });
  }
});

export default router;
