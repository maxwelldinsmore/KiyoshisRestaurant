/*
  Functions file
  Domain: Users
  Desc: Create/fetch/update/delete users plus user order/favorites reads.
*/

-- Create user
CREATE OR REPLACE FUNCTION create_user(
  p_customer_first_name VARCHAR(30),
  p_customer_last_name VARCHAR(30),
  p_customer_phonenumber VARCHAR(10),
  p_customer_email VARCHAR(80),
  p_contact_method VARCHAR(50),
  p_promo_opt_in BOOLEAN DEFAULT FALSE,
  p_password_hash VARCHAR(255) DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_customer_id INTEGER;
BEGIN
  INSERT INTO registered_customer (
    customer_first_name,
    customer_last_name,
    customer_phonenumber,
    customer_email,
    contact_method,
    promo_opt_in,
    customer_password_hash
  )
  VALUES (
    p_customer_first_name,
    p_customer_last_name,
    p_customer_phonenumber,
    p_customer_email,
    p_contact_method,
    p_promo_opt_in,
    p_password_hash
  )
  RETURNING customer_id INTO v_customer_id;

  RETURN v_customer_id;
END;
$$;

-- Fetch user by email (for authentication)
CREATE OR REPLACE FUNCTION get_user_by_email(p_email VARCHAR(80))
RETURNS TABLE (
  customer_id INTEGER,
  customer_first_name VARCHAR(30),
  customer_last_name VARCHAR(30),
  customer_email VARCHAR(80),
  customer_password_hash VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rc.customer_id,
    rc.customer_first_name,
    rc.customer_last_name,
    rc.customer_email,
    rc.customer_password_hash
  FROM registered_customer rc
  WHERE rc.customer_email = p_email
  LIMIT 1;
END;
$$;

-- Fetch one user
CREATE OR REPLACE FUNCTION get_user_by_id(p_customer_id INTEGER)
RETURNS TABLE (
  customer_id INTEGER,
  customer_first_name VARCHAR(30),
  customer_last_name VARCHAR(30),
  customer_phonenumber VARCHAR(10),
  customer_email VARCHAR(80),
  contact_method VARCHAR(50),
  number_of_visits SMALLINT,
  promo_opt_in BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rc.customer_id,
    rc.customer_first_name,
    rc.customer_last_name,
    rc.customer_phonenumber,
    rc.customer_email,
    rc.contact_method,
    rc.number_of_visits,
    rc.promo_opt_in
  FROM registered_customer rc
  WHERE rc.customer_id = p_customer_id;
END;
$$;

-- Fetch all users
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  customer_id INTEGER,
  customer_first_name VARCHAR(30),
  customer_last_name VARCHAR(30),
  customer_phonenumber VARCHAR(10),
  customer_email VARCHAR(80),
  contact_method VARCHAR(50),
  number_of_visits SMALLINT,
  promo_opt_in BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rc.customer_id,
    rc.customer_first_name,
    rc.customer_last_name,
    rc.customer_phonenumber,
    rc.customer_email,
    rc.contact_method,
    rc.number_of_visits,
    rc.promo_opt_in
  FROM registered_customer rc
  ORDER BY rc.customer_id;
END;
$$;

-- Fetch all orders for one user
CREATE OR REPLACE FUNCTION get_user_orders(p_customer_id INTEGER)
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
  WHERE o.customer_id = p_customer_id
  ORDER BY o.order_date DESC, o.order_id DESC;
END;
$$;

-- Fetch user favorites
CREATE OR REPLACE FUNCTION get_user_favorites(p_customer_id INTEGER)
RETURNS TABLE (
  preference_id INTEGER,
  menu_item_id INTEGER,
  menu_item_name VARCHAR(100),
  menu_item_price DECIMAL(7, 2),
  menu_item_description VARCHAR(140),
  is_item_available BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cp.preference_id,
    mi.menu_item_id,
    mi.menu_item_name,
    mi.menu_item_price,
    mi.menu_item_description,
    mi.is_item_available
  FROM customer_preference cp
  JOIN menu_item mi ON mi.menu_item_id = cp.menu_item_id
  WHERE cp.customer_id = p_customer_id
  ORDER BY cp.preference_id;
END;
$$;

-- Edit user
CREATE OR REPLACE FUNCTION update_user(
  p_customer_id INTEGER,
  p_customer_first_name VARCHAR(30) DEFAULT NULL,
  p_customer_last_name VARCHAR(30) DEFAULT NULL,
  p_customer_phonenumber VARCHAR(10) DEFAULT NULL,
  p_customer_email VARCHAR(80) DEFAULT NULL,
  p_contact_method VARCHAR(50) DEFAULT NULL,
  p_promo_opt_in BOOLEAN DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_updated INTEGER;
BEGIN
  UPDATE registered_customer
  SET
    customer_first_name = COALESCE(p_customer_first_name, customer_first_name),
    customer_last_name = COALESCE(p_customer_last_name, customer_last_name),
    customer_phonenumber = COALESCE(p_customer_phonenumber, customer_phonenumber),
    customer_email = COALESCE(p_customer_email, customer_email),
    contact_method = COALESCE(p_contact_method, contact_method),
    promo_opt_in = COALESCE(p_promo_opt_in, promo_opt_in)
  WHERE customer_id = p_customer_id;

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  RETURN v_rows_updated > 0;
END;
$$;

-- Delete user and dependent records
CREATE OR REPLACE FUNCTION delete_user(p_customer_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_deleted INTEGER;
BEGIN
  DELETE FROM customer_preference
  WHERE customer_id = p_customer_id;

  DELETE FROM customer_promotion
  WHERE customer_id = p_customer_id;

  DELETE FROM rewards_redemption
  WHERE customer_id = p_customer_id;

  UPDATE orders
  SET customer_id = NULL
  WHERE customer_id = p_customer_id;

  DELETE FROM registered_customer
  WHERE customer_id = p_customer_id;

  GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
  RETURN v_rows_deleted > 0;
END;
$$;
