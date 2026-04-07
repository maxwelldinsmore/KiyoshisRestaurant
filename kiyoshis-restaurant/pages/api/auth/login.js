/**
 * File: login.js
 * Description: API route that handles user login.
 * Verifies credentials against PostgreSQL, generates a JWT token,
 * and sets it as an httpOnly cookie in the response.
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

  const { email, phone, password } = req.body;

  if ((!email && !phone) || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const rows = email
      ? await sql`
          SELECT customer_id, customer_first_name, customer_last_name, customer_email, customer_password_hash
          FROM registered_customer
          WHERE customer_email = ${email}
          LIMIT 1
        `
      : await sql`
          SELECT customer_id, customer_first_name, customer_last_name, customer_email, customer_password_hash
          FROM registered_customer
          WHERE customer_phonenumber = ${phone}
          LIMIT 1
        `;

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];

    if (!user.customer_password_hash) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.customer_password_hash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      {
        userId: user.customer_id,
        firstName: user.customer_first_name,
        lastName: user.customer_last_name,
        email: user.customer_email,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.customer_id,
        firstName: user.customer_first_name,
        lastName: user.customer_last_name,
        email: user.customer_email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
