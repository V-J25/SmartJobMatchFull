import express from "express";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const router = express.Router();

// Initialize Supabase Client for Admin Auth
const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').trim();
const supabaseKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY || '').trim();

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// In-memory token store for password reset: token -> { email, userId, expiresAt }
const resetTokens = new Map();

// API endpoint to request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Look up user in Supabase Auth
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });

    if (error) {
      console.error("Error listing users from Supabase:", error);
      // Return success to never expose whether an email exists in the system
      return res.json({ message: "If the email is registered, a password reset link has been generated." });
    }

    const user = data?.users?.find(u => u.email?.toLowerCase() === normalizedEmail);

    if (user) {
      // Create secure random token
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = Date.now() + 3600000; // Expires in 1 hour

      resetTokens.set(token, {
        email: normalizedEmail,
        userId: user.id,
        expiresAt
      });

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      
      // Trigger Supabase to send the password reset email directly
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${frontendUrl}/reset-password?token=${token}`,
      });

      if (resetError) {
        console.error("Error triggering Supabase password reset email:", resetError);
        return res.status(500).json({ error: "Failed to send password reset email" });
      }
    }

    res.json({ message: "If the email is registered, a password reset link has been generated." });
  } catch (error) {
    console.error("Forgot password API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint to verify reset token
router.get("/verify-token", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      return res.status(400).json({ valid: false, error: "Token is required" });
    }

    const tokenInfo = resetTokens.get(token);
    if (!tokenInfo) {
      return res.status(400).json({ valid: false, error: "Invalid or expired reset token" });
    }

    if (tokenInfo.expiresAt < Date.now()) {
      resetTokens.delete(token); // Clean up expired token
      return res.status(400).json({ valid: false, error: "Invalid or expired reset token" });
    }

    res.json({ valid: true, email: tokenInfo.email });
  } catch (error) {
    console.error("Verify token API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint to reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || typeof token !== "string" || !password || typeof password !== "string") {
      return res.status(400).json({ error: "Token and password are required" });
    }

    const tokenInfo = resetTokens.get(token);
    if (!tokenInfo) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    if (tokenInfo.expiresAt < Date.now()) {
      resetTokens.delete(token); // Clean up expired token
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Update the password in Supabase Auth using GoTrue Admin Client (uses the same hashing mechanism)
    const { error } = await supabase.auth.admin.updateUserById(tokenInfo.userId, {
      password: password
    });

    if (error) {
      console.error("Error updating user password in Supabase:", error);
      return res.status(500).json({ error: error.message || "Failed to update password" });
    }

    // Remove token so it cannot be reused
    resetTokens.delete(token);

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset password API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
