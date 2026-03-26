import jwt from 'jsonwebtoken';
import sql from '../db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    // Get current password hash
    const rows = await sql`
      SELECT customer_password_hash
      FROM registered_customer
      WHERE customer_id = ${decoded.userId}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, rows[0].customer_password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    await sql`
      UPDATE registered_customer
      SET customer_password_hash = ${newPasswordHash}
      WHERE customer_id = ${decoded.userId}
    `;

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Password change error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
