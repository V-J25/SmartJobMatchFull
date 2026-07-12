import supabase from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const requireRole = (role) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (error || !data) {
        return res.status(403).json({ error: 'Role not found' });
      }

      let dbRole = data ? data.role : null;
      let finalRole = req.user.user_metadata?.role || dbRole || 'seeker';

      if (finalRole !== role) {
        return res.status(403).json({ error: `Requires ${role} role` });
      }

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};
