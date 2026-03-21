import sql from './db';

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Users API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function handleGet(req, res) {
  const { customer_id: customerId, include } = req.query;

  if (customerId && include === 'orders') {
    const data = await sql`SELECT * FROM get_user_orders(${Number(customerId)})`;
    return res.status(200).json({ success: true, count: data.length, data });
  }

  if (customerId && include === 'favorites') {
    const data = await sql`SELECT * FROM get_user_favorites(${Number(customerId)})`;
    return res.status(200).json({ success: true, count: data.length, data });
  }

  if (customerId) {
    const data = await sql`SELECT * FROM get_user_by_id(${Number(customerId)})`;
    return res.status(200).json({ success: true, count: data.length, data });
  }

  const data = await sql`SELECT * FROM get_all_users()`;
  return res.status(200).json({ success: true, count: data.length, data });
}

async function handlePost(req, res) {
  const {
    customer_first_name: firstName,
    customer_last_name: lastName,
    customer_phonenumber: phone,
    customer_email: email,
    contact_method: contactMethod,
    promo_opt_in: promoOptIn,
  } = req.body;

  const data = await sql`
    SELECT create_user(
      ${firstName ?? null},
      ${lastName ?? null},
      ${phone ?? null},
      ${email ?? null},
      ${contactMethod ?? null},
      ${promoOptIn ?? false}
    ) AS customer_id
  `;

  return res.status(201).json({ success: true, data: data[0] });
}

async function handlePut(req, res) {
  const {
    customer_id: customerId,
    customer_first_name: firstName,
    customer_last_name: lastName,
    customer_phonenumber: phone,
    customer_email: email,
    contact_method: contactMethod,
    promo_opt_in: promoOptIn,
  } = req.body;

  if (!customerId) {
    return res.status(400).json({ success: false, error: 'customer_id is required' });
  }

  const data = await sql`
    SELECT update_user(
      ${Number(customerId)},
      ${firstName ?? null},
      ${lastName ?? null},
      ${phone ?? null},
      ${email ?? null},
      ${contactMethod ?? null},
      ${promoOptIn ?? null}
    ) AS updated
  `;

  return res.status(200).json({ success: true, data: data[0] });
}

async function handleDelete(req, res) {
  const { customer_id: customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ success: false, error: 'customer_id is required' });
  }

  const data = await sql`SELECT delete_user(${Number(customerId)}) AS deleted`;
  return res.status(200).json({ success: true, data: data[0] });
}
