/**
 * File: user.js
 * Description: API route that retrieves the authenticated user's information
 * from PostgreSQL based on the JWT token stored in the cookie.
 */

import jwt from 'jsonwebtoken';
import sql from '../db';

export default async function handler(req, res) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const rows = await sql`
      SELECT customer_id, customer_first_name, customer_last_name, customer_email,
             contact_method, number_of_visits, promo_opt_in
      FROM registered_customer
      WHERE customer_id = ${decoded.userId}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return res.status(401).json({ user: null });
    }

    const user = rows[0];
    return res.status(200).json({
      user: {
        id: user.customer_id,
        firstName: user.customer_first_name,
        lastName: user.customer_last_name,
        email: user.customer_email,
        contactMethod: user.contact_method,
        numberOfVisits: user.number_of_visits,
        promoOptIn: user.promo_opt_in,
      },
    });
  } catch (err) {
    return res.status(401).json({ user: null });
  }
}
