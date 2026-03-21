/**
 * File: logout.js
 * Authors: Alyssa Bhagwandin
 * Last Edited: 2026-03-20
 * Description: This file is for the API route that handles user logout. 
 * It invalidates the user's JWT token by setting it as an expired cookie.
 */

import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const cookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ message: 'Logged out successfully.' });
}
