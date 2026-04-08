import sql from '../db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, contactMethod, promoOptIn, password } = req.body;

  // Basic validation
  if (!firstName || !lastName || !email || !phone || !contactMethod || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (firstName.length > 30 || lastName.length > 30) {
    return res.status(400).json({ message: 'Name must be 30 characters or fewer.' });
  }

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: 'Phone number must be exactly 10 digits.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  try {
    // Check for duplicate email
    const existing = await sql`
      SELECT 1 FROM registered_customer WHERE customer_email = ${email} LIMIT 1
    `;

    if (existing.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create the customer
    const result = await sql`
      SELECT create_user(
        ${firstName},
        ${lastName},
        ${phone},
        ${email},
        ${contactMethod},
        ${promoOptIn ?? false},
        ${passwordHash}
      ) AS customer_id
    `;

    const customerId = result[0]?.customer_id;
    // Show a short welcome message for SMS integration test
    return res.status(201).json({
      message: 'Account created!',
      customerId,
      welcome: 'Welcome to Sushi Bai Kiyoshi’s! Thank you for registering. Here youll receive updates and promotions!'
    });

  } catch (err) {
    console.error('Register API error:', err);
    return res.status(500).json({
      message: 'Server error. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { detail: err.message }),
    });
  }
}
