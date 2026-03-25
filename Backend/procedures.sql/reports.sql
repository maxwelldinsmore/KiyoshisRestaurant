-- Sales grouped by day
CREATE OR REPLACE FUNCTION get_sales_by_day()
RETURNS TABLE (
  order_date DATE,
  total_sales DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    DATE(o.order_date) AS order_date,
    SUM(o.order_total) AS total_sales
FROM orders o
GROUP BY DATE(o.order_date)
ORDER BY order_date;
END;
$$;

-- Best-selling menu items
CREATE OR REPLACE FUNCTION get_best_selling_items()
RETURNS TABLE (
  menu_item_id INTEGER,
  menu_item_name VARCHAR(100),
  total_sold BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    mi.menu_item_id,
    mi.menu_item_name,
    COUNT(oi.menu_item_id) AS total_sold
FROM order_item oi
         JOIN menu_item mi ON mi.menu_item_id = oi.menu_item_id
GROUP BY mi.menu_item_id, mi.menu_item_name
ORDER BY total_sold DESC;
END;
$$;

-- Items running low
CREATE OR REPLACE FUNCTION get_low_inventory_items()
RETURNS TABLE (
  inventory_item_id INTEGER,
  supplier_name VARCHAR(50),
  quantity_available SMALLINT
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    ii.inventory_item_id,
    s.supplier_name,
    ii.quantity_available
FROM inventory_item ii
         LEFT JOIN supplier s ON s.supplier_id = ii.supplier_id
WHERE COALESCE(ii.quantity_available, 0) < 10 -- threshold
ORDER BY ii.quantity_available ASC;
END;
$$;


-- Expiring soon
CREATE OR REPLACE FUNCTION get_expiring_inventory()
RETURNS TABLE (
  inventory_item_id INTEGER,
  expiry_date TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT
    it.inventory_item_id,
    it.expiry_date
FROM inventory_transaction it
WHERE it.expiry_date IS NOT NULL
  AND it.expiry_date < CURRENT_TIMESTAMP + INTERVAL '3 days'
ORDER BY it.expiry_date;
END;
$$;