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
    console.error('Orders API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

async function handleGet(req, res) {
  const { order_status: orderStatus, order_id: orderId, report } = req.query;

  if (orderId) {
    const order = await sql`SELECT * FROM get_order_by_id(${Number(orderId)})`;
    return res.status(200).json({ success: true, count: order.length, data: order });
  }

  if (orderStatus) {
    const data = await sql`SELECT * FROM get_orders_by_status(${orderStatus})`;
    return res.status(200).json({ success: true, count: data.length, data });
  }

  if (report === 'sales_by_day') {
    const data = await sql`
      SELECT DATE(order_date) AS order_date, SUM(order_total) AS total_sales
      FROM orders
      GROUP BY DATE(order_date)
      ORDER BY DATE(order_date)
    `;
    return res.status(200).json({ success: true, count: data.length, data });
  }

  if (report === 'best_selling') {
    const data = await sql`
      SELECT m.menu_item_name, SUM(oi.order_item_quantity) AS total_sold
      FROM order_item oi
      JOIN menu_item m ON m.menu_item_id = oi.menu_item_id
      GROUP BY m.menu_item_name
      ORDER BY total_sold DESC
      LIMIT 10
    `;
    return res.status(200).json({ success: true, count: data.length, data });
  }

  const data = await sql`SELECT * FROM get_all_orders()`;
  return res.status(200).json({ success: true, count: data.length, data });
}

async function handlePost(req, res) {
  const { action } = req.body ?? {};

  if (action === 'add_reward') {
    const { customer_id: customerId, reward_id: rewardId, order_id: orderId } = req.body;
    const data = await sql`
      SELECT add_reward_to_order(${Number(customerId)}, ${Number(rewardId)}, ${Number(orderId)}) AS redemption_id
    `;
    return res.status(201).json({ success: true, data: data[0] });
  }

  if (action === 'update_reward_count') {
    const { customer_id: customerId, visit_increment: visitIncrement } = req.body;
    const data = await sql`
      SELECT update_reward_count(${Number(customerId)}, ${visitIncrement ?? 1}) AS updated
    `;
    return res.status(200).json({ success: true, data: data[0] });
  }

  const {
    customer_id: customerId,
    employee_id: employeeId,
    guest_phone_num: guestPhoneNum,
    guest_email: guestEmail,
    order_total: orderTotal,
    pick_up_time: pickUpTime,
    order_status: orderStatus,
    order_type: orderType,
  } = req.body;

  const data = await sql`
    SELECT create_order(
      ${customerId ?? null},
      ${employeeId ?? null},
      ${guestPhoneNum ?? null},
      ${guestEmail ?? null},
      ${orderTotal ?? null},
      ${pickUpTime ?? null},
      ${orderStatus ?? null},
      ${orderType ?? null}
    ) AS order_id
  `;

  return res.status(201).json({ success: true, data: data[0] });
}

async function handlePut(req, res) {
  const {
    order_id: orderId,
    customer_id: customerId,
    employee_id: employeeId,
    guest_phone_num: guestPhoneNum,
    guest_email: guestEmail,
    order_total: orderTotal,
    pick_up_time: pickUpTime,
    order_status: orderStatus,
    order_type: orderType,
  } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, error: 'order_id is required' });
  }

  const data = await sql`
    SELECT update_order(
      ${Number(orderId)},
      ${customerId ?? null},
      ${employeeId ?? null},
      ${guestPhoneNum ?? null},
      ${guestEmail ?? null},
      ${orderTotal ?? null},
      ${pickUpTime ?? null},
      ${orderStatus ?? null},
      ${orderType ?? null}
    ) AS updated
  `;

  return res.status(200).json({ success: true, data: data[0] });
}

async function handleDelete(req, res) {
  const { order_id: orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, error: 'order_id is required' });
  }

  const data = await sql`SELECT delete_order(${Number(orderId)}) AS deleted`;
  return res.status(200).json({ success: true, data: data[0] });
}