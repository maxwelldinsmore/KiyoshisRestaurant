import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, phonenumber } = req.body;

  if (email) {
    return sendEmail(res, email)
  }
  return res.status(400).json({ error: 'Bad Request' });
  // if (phonenumber) {
  //   sendSMS(res, phonenumber)
  // }
}

async function sendEmail(res, email) {
  try {
    const resend = new Resend(process.env.RESEND_KEY);
    email = 'maxwell.dinsmore@dcmail.ca'
    await resend.emails.send({
      from: 'onboarding@wikifyd.ca',
      to: email,
      subject: 'Your Sushi Order Is Ready!',
      html: 'Your order is ready for pickup!'
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function sendSMS(res, phonenumber) {
  try {

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}