/*
  Functions file
  Domain: Orders
  Desc: CRUD plus reward linkage and customer reward-count updates.
*/

-- Get detailed list of orders by status
CREATE OR REPLACE FUNCTION get_orders_by_status(p_order_status VARCHAR(50))
RETURNS TABLE (
  order_id INTEGER,
  customer_id INTEGER,
  customer_first_name VARCHAR(30),
  customer_last_name VARCHAR(30),
  customer_phonenumber VARCHAR(10),
  customer_email VARCHAR(80),
  contact_method VARCHAR(50),
  employee_id INTEGER,
  employee_first_name VARCHAR(30),
  employee_last_name VARCHAR(30),
  guest_phone_num VARCHAR(20),
  guest_email VARCHAR(100),
  order_total DECIMAL(10, 2),
  order_date TIMESTAMP,
  pick_up_time TIMESTAMP,
  order_status VARCHAR(50),
  order_type VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    o.order_id,
    o.customer_id,
    c.customer_first_name,
    c.customer_last_name,
    c.customer_phonenumber,
    c.customer_email,
    c.contact_method,
    o.employee_id,
    e.employee_first_name,
    e.employee_last_name,
    o.guest_phone_num,
    o.guest_email,
    o.order_total,
    o.order_date,
    o.pick_up_time,
    o.order_status,
    o.order_type
  FROM orders o
  LEFT JOIN registered_customer c ON c.customer_id = o.customer_id
  LEFT JOIN employee e ON e.employee_id = o.employee_id
  WHERE o.order_status = p_order_status
  ORDER BY o.order_date DESC, o.order_id DESC;
END;
$$;

-- Get all orders
CREATE OR REPLACE FUNCTION get_all_orders()
RETURNS TABLE (
  order_id INTEGER,
  customer_id INTEGER,
  customer_first_name VARCHAR(30),
  customer_last_name VARCHAR(30),
  customer_phonenumber VARCHAR(10),
  customer_email VARCHAR(80),
  contact_method VARCHAR(50),
  employee_id INTEGER,
  employee_first_name VARCHAR(30),
  employee_last_name VARCHAR(30),
  guest_phone_num VARCHAR(20),
  guest_email VARCHAR(100),
  order_total DECIMAL(10, 2),
  order_date TIMESTAMP,
  pick_up_time TIMESTAMP,
  order_status VARCHAR(50),
  order_type VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    o.order_id,
    o.customer_id,
    c.customer_first_name,
    c.customer_last_name,
    c.customer_phonenumber,
    c.customer_email,
    c.contact_method,
    o.employee_id,
    e.employee_first_name,
    e.employee_last_name,
    o.guest_phone_num,
    o.guest_email,
    o.order_total,
    o.order_date,
    o.pick_up_time,
    o.order_status,
    o.order_type
  FROM orders o
  LEFT JOIN registered_customer c ON c.customer_id = o.customer_id
  LEFT JOIN employee e ON e.employee_id = o.employee_id
  ORDER BY o.order_date DESC, o.order_id DESC;
END;
$$;

-- Create order
CREATE OR REPLACE FUNCTION create_order(
  p_customer_id INTEGER,
  p_employee_id INTEGER,
  p_guest_phone_num VARCHAR(20),
  p_guest_email VARCHAR(100),
  p_order_total DECIMAL(10, 2),
  p_pick_up_time TIMESTAMP,
  p_order_status VARCHAR(50),
  p_order_type VARCHAR(50)
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_order_id INTEGER;
BEGIN
  INSERT INTO orders (
    customer_id,
    employee_id,
    guest_phone_num,
    guest_email,
    order_total,
    pick_up_time,
    order_status,
    order_type
  )
  VALUES (
    p_customer_id,
    p_employee_id,
    p_guest_phone_num,
    p_guest_email,
    p_order_total,
    p_pick_up_time,
    p_order_status,
    p_order_type
  )
  RETURNING order_id INTO v_order_id;

  RETURN v_order_id;
END;
$$;

-- Fetch one order
CREATE OR REPLACE FUNCTION get_order_by_id(p_order_id INTEGER)
RETURNS TABLE (
  order_id INTEGER,
  customer_id INTEGER,
  employee_id INTEGER,
  guest_phone_num VARCHAR(20),
  guest_email VARCHAR(100),
  order_total DECIMAL(10, 2),
  order_date TIMESTAMP,
  pick_up_time TIMESTAMP,
  order_status VARCHAR(50),
  order_type VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    o.order_id,
    o.customer_id,
    o.employee_id,
    o.guest_phone_num,
    o.guest_email,
    o.order_total,
    o.order_date,
    o.pick_up_time,
    o.order_status,
    o.order_type
  FROM orders o
  WHERE o.order_id = p_order_id;
END;
$$;

-- Update order
CREATE OR REPLACE FUNCTION update_order(
  p_order_id INTEGER,
  p_customer_id INTEGER DEFAULT NULL,
  p_employee_id INTEGER DEFAULT NULL,
  p_guest_phone_num VARCHAR(20) DEFAULT NULL,
  p_guest_email VARCHAR(100) DEFAULT NULL,
  p_order_total DECIMAL(10, 2) DEFAULT NULL,
  p_pick_up_time TIMESTAMP DEFAULT NULL,
  p_order_status VARCHAR(50) DEFAULT NULL,
  p_order_type VARCHAR(50) DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_updated INTEGER;
BEGIN
  UPDATE orders
  SET
    customer_id = COALESCE(p_customer_id, customer_id),
    employee_id = COALESCE(p_employee_id, employee_id),
    guest_phone_num = COALESCE(p_guest_phone_num, guest_phone_num),
    guest_email = COALESCE(p_guest_email, guest_email),
    order_total = COALESCE(p_order_total, order_total),
    pick_up_time = COALESCE(p_pick_up_time, pick_up_time),
    order_status = COALESCE(p_order_status, order_status),
    order_type = COALESCE(p_order_type, order_type)
  WHERE order_id = p_order_id;

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  RETURN v_rows_updated > 0;
END;
$$;

-- Delete order and dependent records
CREATE OR REPLACE FUNCTION delete_order(p_order_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_deleted INTEGER;
BEGIN
  DELETE FROM rewards_redemption
  WHERE order_id = p_order_id;

  DELETE FROM order_payment
  WHERE order_id = p_order_id;

  DELETE FROM order_item
  WHERE order_id = p_order_id;

  DELETE FROM orders
  WHERE order_id = p_order_id;

  GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
  RETURN v_rows_deleted > 0;
END;
$$;

-- Add reward to order (reward redemption record)
CREATE OR REPLACE FUNCTION add_reward_to_order(
  p_customer_id INTEGER,
  p_reward_id INTEGER,
  p_order_id INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_redemption_id INTEGER;
BEGIN
  INSERT INTO rewards_redemption (
    customer_id,
    reward_id,
    order_id
  )
  VALUES (
    p_customer_id,
    p_reward_id,
    p_order_id
  )
  RETURNING redemption_id INTO v_redemption_id;

  RETURN v_redemption_id;
END;
$$;

-- Update reward count for a customer by incrementing number_of_visits
CREATE OR REPLACE FUNCTION update_reward_count(
  p_customer_id INTEGER,
  p_visit_increment SMALLINT DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_updated INTEGER;
BEGIN
  UPDATE registered_customer
  SET number_of_visits = COALESCE(number_of_visits, 0) + COALESCE(p_visit_increment, 0)
  WHERE customer_id = p_customer_id;

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  RETURN v_rows_updated > 0;
END;
$$;

-- Get order items for a specific order
CREATE OR REPLACE FUNCTION get_order_items_by_order(p_order_id INTEGER)
RETURNS TABLE (
  menu_item_name VARCHAR,
  order_item_quantity INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    m.menu_item_name,
    oi.order_item_quantity
FROM order_item oi
         JOIN menu_item m ON m.menu_item_id = oi.menu_item_id
WHERE oi.order_id = p_order_id;
END;
$$;

-- Reset all orders to Pending status
UPDATE orders SET order_status = 'Pending';