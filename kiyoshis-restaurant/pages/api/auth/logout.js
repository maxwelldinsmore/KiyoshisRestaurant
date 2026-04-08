/**
 * File: logout.js
 * Description: API route to logout user by clearing the adminToken cookie.
 */

import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const adminTokenCookie = serialize('adminToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  const userTokenCookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  res.setHeader('Set-Cookie', [adminTokenCookie, userTokenCookie]);
  return res.status(200).json({ message: 'Logout successful' });
}
