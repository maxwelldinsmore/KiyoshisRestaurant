/**
 * File: employee-login.js
 * Description: API route for employee login.
 * Verifies employee credentials, checks if account is admin,
 * and sets a JWT token as httpOnly cookie.
 */

import sql from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const rows = await sql`
      SELECT employee_id, employee_first_name, employee_last_name, employee_email, employee_password_hash
      FROM employee
      WHERE employee_email = ${email}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const employee = rows[0];

    if (!employee.employee_password_hash) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, employee.employee_password_hash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // All employees are admins
    const token = jwt.sign(
      {
        employeeId: employee.employee_id,
        firstName: employee.employee_first_name,
        lastName: employee.employee_last_name,
        email: employee.employee_email,
        isAdmin: true,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    const cookie = serialize('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 28800, // 8 hours
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: employee.employee_id,
        firstName: employee.employee_first_name,
        lastName: employee.employee_last_name,
        email: employee.employee_email,
        isAdmin: true,
      },
    });
  } catch (error) {
    console.error('Employee login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
