import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, message } = req.body;
  if (!to || !message) {
    return res.status(400).json({ error: 'Missing phone number or message' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

  if (!accountSid || !authToken || !messagingServiceSid) {
    console.error('[SMS ERROR] Missing Twilio credentials in .env file');
    return res.status(500).json({ error: 'Twilio credentials not set' });
  }

  const client = twilio(accountSid, authToken);

  try {
    await client.messages.create({
      body: message,
      messagingServiceSid: messagingServiceSid,
      to
    });
    res.json({ success: true });
  } catch (err) {
    console.error('[SMS ERROR from Twilio]:', err.message);
    res.status(500).json({ error: err.message });
  }
}
