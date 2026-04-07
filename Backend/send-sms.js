// Simple SMS sending endpoint using Twilio
const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Replace with your Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// POST /api/send-sms
router.post('/send-sms', async (req, res) => {
  const { to, message } = req.body;
  if (!to || !message) {
    return res.status(400).json({ error: 'Missing phone number or message' });
  }
  try {
    await client.messages.create({
      body: message,
      from: twilioPhone,
      to
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
