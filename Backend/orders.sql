/*
  Functions file
  Auth: Maxwell Dinsmore
  Last Update: 2026-03-16
  Workflow: Ran within docker compose
  Desc: Created stored reading proccesses
*/

-- GET Requests

-- Get detailed list of orders by status.
-- Usage:
--   SELECT * FROM get_orders_by_status('Pending');
CREATE OR REPLACE FUNCTION get_orders_by_status(p_order_status VARCHAR(50))
RETURNS TABLE (
  order_id INTEGER, customer_id INTEGER, customer_first_name VARCHAR(30),
  customer_last_name VARCHAR(30), employee_id INTEGER, employee_first_name VARCHAR(30),
  employee_last_name VARCHAR(30), guest_phone_num VARCHAR(20), guest_email VARCHAR(100),
  order_total DECIMAL(10, 2), order_date TIMESTAMP, pick_up_time TIMESTAMP,
  order_status VARCHAR(50), order_type VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    o.order_id, o.customer_id, c.customer_first_name,
    c.customer_last_name, o.employee_id, e.employee_first_name,
    e.employee_last_name, o.guest_phone_num,
    o.guest_email, o.order_total, o.order_date,
    o.pick_up_time, o.order_status, o.order_type
  FROM orders o
  LEFT JOIN registered_customer c ON c.customer_id = o.customer_id
  LEFT JOIN employee e ON e.employee_id = o.employee_id
  WHERE o.order_status = p_order_status
  ORDER BY o.order_date DESC, o.order_id DESC;
END;
$$;

CREATE OR REPLACE FUNCTION get_all_orders()
RETURNS TABLE (
  order_id INTEGER, customer_id INTEGER, customer_first_name VARCHAR(30),
  customer_last_name VARCHAR(30), employee_id INTEGER, employee_first_name VARCHAR(30),
  employee_last_name VARCHAR(30), guest_phone_num VARCHAR(20), guest_email VARCHAR(100),
  order_total DECIMAL(10, 2), order_date TIMESTAMP, pick_up_time TIMESTAMP,
  order_status VARCHAR(50), order_type VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    o.order_id, o.customer_id, c.customer_first_name,
    c.customer_last_name, o.employee_id, e.employee_first_name,
    e.employee_last_name, o.guest_phone_num, o.guest_email,
    o.order_total, o.order_date, o.pick_up_time,
    o.order_status, o.order_type
  FROM orders o
  LEFT JOIN registered_customer c ON c.customer_id = o.customer_id
  LEFT JOIN employee e ON e.employee_id = o.employee_id
  ORDER BY o.order_date DESC, o.order_id DESC;
END;
$$ LANGUAGE plpgsql;