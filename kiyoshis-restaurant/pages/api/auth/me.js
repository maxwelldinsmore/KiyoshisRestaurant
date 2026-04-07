/**
 * File: me.js
 * Description: API route to get current authenticated user info.
 * Verifies JWT token from httpOnly cookie (supports both customer and employee tokens).
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Check for admin token (employee) first, then regular token (customer)
    const token = req.cookies.adminToken || req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Handle both employee and customer token formats
    if (decoded.employeeId) {
      // Employee token format
      return res.status(200).json({
        user: {
          id: decoded.employeeId,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          isAdmin: decoded.isAdmin,
        },
      });
    } else if (decoded.userId) {
      // Customer token format
      return res.status(200).json({
        user: {
          id: decoded.userId,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          isAdmin: false,
        },
      });
    } else {
      return res.status(401).json({ message: 'Invalid token format' });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}
