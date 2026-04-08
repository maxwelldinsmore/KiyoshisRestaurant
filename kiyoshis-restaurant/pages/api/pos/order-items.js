import sql from '../db';

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST':
        return await handlePost(req, res);
      case 'GET':
        return await handleGet(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('POS Order Items API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

async function handlePost(req, res) {
  const {
    order_id: orderId,
    items,
    discount_percent: discountPercent,
    payment_method: paymentMethod,
  } = req.body;

  if (!orderId || !items || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'order_id and items array are required',
    });
  }

  try {
    // Add each item to the order
    for (const item of items) {
      const { menu_item_id: menuItemId, quantity, price } = item;

      if (!menuItemId || !quantity) {
        return res.status(400).json({
          success: false,
          error: 'Each item must have menu_item_id and quantity',
        });
      }

      await sql`
        INSERT INTO order_item (order_id, menu_item_id, order_item_quantity)
        VALUES (
          ${Number(orderId)},
          ${Number(menuItemId)},
          ${Number(quantity)}
        )
      `;
    }

    return res.status(201).json({
      success: true,
      message: 'Order items added successfully',
      order_id: orderId,
    });
  } catch (error) {
    console.error('Error adding order items:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add items to order',
    });
  }
}

async function handleGet(req, res) {
  const { order_id: orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({
      success: false,
      error: 'order_id is required',
    });
  }

  try {
    const items = await sql`
      SELECT *
      FROM get_order_items_by_order(${Number(orderId)})
    `;

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching order items:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch order items',
    });
  }
}
