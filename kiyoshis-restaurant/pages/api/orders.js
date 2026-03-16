import sql from './db';



export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const { order_status: orderStatus } = req.query;
        return orderStatus ? await getOrdersByStatus(res, orderStatus) : await getAllOrders(res);

      } catch (error) {
        console.error('Orders API error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch orders',
        });
      }

    case 'POST':
    case 'PUT':
    case 'DELETE':
      return res.status(501).json({ error: `${req.method} not implemented for /api/orders` });

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}


export async function getAllOrders(res) {
    try {
        data =  sql.begin(async (tx) => {
            const orders = await sql`SELECT * FROM get_all_orders()`;
            return orders;
        });
        return res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    } catch {
        return res.status(400).json({
            success: false,
        });
    }

}
// 3 statuses are Ready, Being Made, Completed
export async function getOrdersByStatus(res, orderStatus) {

    if (orderStatus != "Ready" || orderStatus != "Being Made" || orderStatus != "Completed" ) {
        return res.status(405).json({ error: 'badrequest' });
    }

    try {
        data =  sql.begin(async (tx) => {
            await tx`CALL get_orders_by_status(${orderStatus}, 'orders_by_status_cursor')`;
          const orders = await tx`FETCH ALL FROM orders_by_status_cursor`;
            return orders;
        });
        return res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    } catch {
        return res.status(400).json({
            success: false,
            count: data.length,
            data,
        });
    }
}