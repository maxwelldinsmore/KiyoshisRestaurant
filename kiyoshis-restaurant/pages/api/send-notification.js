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
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f7fa;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 40px 20px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo h1 {
              color: #152d4b;
              margin: 0;
              font-size: 28px;
            }
            .content {
              text-align: center;
              margin-bottom: 30px;
            }
            .content h2 {
              color: #152d4b;
              font-size: 24px;
              margin-top: 0;
              margin-bottom: 15px;
            }
            .content p {
              color: #666;
              font-size: 16px;
              margin: 10px 0;
            }
            .button {
              display: inline-block;
              background-color: #b21f2d;
              color: white;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
              transition: background-color 0.3s;
            }
            .button:hover {
              background-color: #8b1622;
            }
            .footer {
              border-top: 1px solid #e0e0e0;
              margin-top: 30px;
              padding-top: 20px;
              text-align: center;
              color: #999;
              font-size: 12px;
            }
            .footer a {
              color: #152d4b;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>🍣 Kiyoshi's Restaurant</h1>
            </div>

            <div class="content">
              <h2>Your Order Is Ready!</h2>
              <p>Great news! Your delicious sushi order is ready for pickup.</p>
              <p>Please come pick up your order at your earliest convenience.</p>

              <a href="https://kiyoshis-restaurant.vercel.app/account" class="button">View Order Details</a>
            </div>

            <div class="footer">
              <p>Enjoy your meal!</p>
              <p>
                <a href="https://kiyoshis-restaurant.vercel.app/account">Manage Notification Preferences</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
    await resend.emails.send({
      from: 'onboarding@wikifyd.ca',
      to: email,
      subject: 'Your Sushi Order Is Ready!',
      html: htmlContent
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