import sql from '../db';

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST':
        return await handlePost(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('POS Checkout API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

async function handlePost(req, res) {
  const { action } = req.body ?? {};

  if (action === 'complete_payment') {
    return await completePayment(req, res);
  }

  if (action === 'void_transaction') {
    return await voidTransaction(req, res);
  }

  return res.status(400).json({
    success: false,
    error: 'Invalid action',
  });
}

async function completePayment(req, res) {
  const {
    order_id: orderId,
    amount_tendered: amountTendered,
    payment_method: paymentMethod,
    notes,
  } = req.body;

  if (!orderId || amountTendered === undefined) {
    return res.status(400).json({
      success: false,
      error: 'order_id and amount_tendered are required',
    });
  }

  try {
    // Get order details
    const orderData = await sql`
      SELECT order_total, order_status FROM orders WHERE order_id = ${Number(orderId)}
    `;

    if (!orderData.length) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    const order = orderData[0];

    // Validate payment amount
    if (parseFloat(amountTendered) < parseFloat(order.order_total)) {
      return res.status(400).json({
        success: false,
        error: 'Amount tendered is less than order total',
        required: order.order_total,
        tendered: amountTendered,
      });
    }

    const change = parseFloat(amountTendered) - parseFloat(order.order_total);

    // Update order status to completed
    await sql`
      UPDATE orders
      SET
        order_status = 'completed',
        payment_method = ${paymentMethod || 'cash'},
        modified_date = NOW()
      WHERE order_id = ${Number(orderId)}
    `;

    return res.status(200).json({
      success: true,
      message: 'Payment completed',
      order_id: orderId,
      total: parseFloat(order.order_total).toFixed(2),
      change: change.toFixed(2),
      payment_method: paymentMethod || 'cash',
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process payment',
    });
  }
}

async function voidTransaction(req, res) {
  const { order_id: orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({
      success: false,
      error: 'order_id is required',
    });
  }

  try {
    // Check if order can be voided (not already completed)
    const orderData = await sql`
      SELECT order_status FROM orders WHERE order_id = ${Number(orderId)}
    `;

    if (!orderData.length) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    if (orderData[0].order_status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot void a completed order',
      });
    }

    // Delete the order
    await sql`DELETE FROM orders WHERE order_id = ${Number(orderId)}`;

    return res.status(200).json({
      success: true,
      message: 'Order voided successfully',
      order_id: orderId,
    });
  } catch (error) {
    console.error('Void transaction error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to void transaction',
    });
  }
}
