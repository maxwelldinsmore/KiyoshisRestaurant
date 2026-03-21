/*
  Functions file
  Domain: Inventory
  Desc: Inventory CRUD, totals, nightly error report, and inventory type mapping.
*/

-- Create inventory item
CREATE OR REPLACE FUNCTION create_inventory_item(
  p_supplier_id INTEGER,
  p_purchase_date TIMESTAMP,
  p_quantity_available SMALLINT,
  p_unit_weight_available DECIMAL(8, 4)
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_inventory_item_id INTEGER;
BEGIN
  INSERT INTO inventory_item (
    supplier_id, purchase_date,
    quantity_available, unit_weight_available
  )
  VALUES (
    p_supplier_id, p_purchase_date,
    p_quantity_available, p_unit_weight_available
  )
  RETURNING inventory_item_id INTO v_inventory_item_id;

  RETURN v_inventory_item_id;
END;
$$;

-- Fetch one inventory item
CREATE OR REPLACE FUNCTION get_inventory_item_by_id(p_inventory_item_id INTEGER)
RETURNS TABLE (
  inventory_item_id INTEGER, supplier_id INTEGER,
  supplier_name VARCHAR(50), purchase_date TIMESTAMP,
  quantity_available SMALLINT, unit_weight_available DECIMAL(8, 4)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ii.inventory_item_id, ii.supplier_id,
    s.supplier_name, ii.purchase_date,
    ii.quantity_available, ii.unit_weight_available
  FROM inventory_item ii
  LEFT JOIN supplier s ON s.supplier_id = ii.supplier_id
  WHERE ii.inventory_item_id = p_inventory_item_id;
END;
$$;

-- Fetch all inventory items
CREATE OR REPLACE FUNCTION get_all_inventory_items()
RETURNS TABLE (
  inventory_item_id INTEGER, supplier_id INTEGER,
  supplier_name VARCHAR(50), purchase_date TIMESTAMP,
  quantity_available SMALLINT, unit_weight_available DECIMAL(8, 4)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ii.inventory_item_id, ii.supplier_id,
    s.supplier_name, ii.purchase_date,
    ii.quantity_available, ii.unit_weight_available
  FROM inventory_item ii
  LEFT JOIN supplier s ON s.supplier_id = ii.supplier_id
  ORDER BY ii.inventory_item_id;
END;
$$;

-- Update inventory item
CREATE OR REPLACE FUNCTION update_inventory_item(
  p_inventory_item_id INTEGER, p_supplier_id INTEGER DEFAULT NULL,
  p_purchase_date TIMESTAMP DEFAULT NULL, p_quantity_available SMALLINT DEFAULT NULL,
  p_unit_weight_available DECIMAL(8, 4) DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_updated INTEGER;
BEGIN
  UPDATE inventory_item
  SET
    supplier_id = COALESCE(p_supplier_id, supplier_id),
    purchase_date = COALESCE(p_purchase_date, purchase_date),
    quantity_available = COALESCE(p_quantity_available, quantity_available),
    unit_weight_available = COALESCE(p_unit_weight_available, unit_weight_available)
  WHERE inventory_item_id = p_inventory_item_id;

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  RETURN v_rows_updated > 0;
END;
$$;

-- Delete inventory item
CREATE OR REPLACE FUNCTION delete_inventory_item(p_inventory_item_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_deleted INTEGER;
BEGIN
  DELETE FROM inventory_menu_item
  WHERE inventory_item_id = p_inventory_item_id;

  DELETE FROM inventory_transaction
  WHERE inventory_item_id = p_inventory_item_id;

  DELETE FROM waste_log
  WHERE inventory_item_id = p_inventory_item_id;

  DELETE FROM inventory_item
  WHERE inventory_item_id = p_inventory_item_id;

  GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
  RETURN v_rows_deleted > 0;
END;
$$;

-- Fetch total inventory snapshot
CREATE OR REPLACE FUNCTION get_total_inventory()
RETURNS TABLE (
  item_count BIGINT,
  total_quantity BIGINT,
  total_unit_weight DECIMAL(20, 4)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS item_count,
    COALESCE(SUM(COALESCE(ii.quantity_available, 0)), 0)::BIGINT AS total_quantity,
    COALESCE(SUM(COALESCE(ii.unit_weight_available, 0)), 0)::DECIMAL(20, 4) AS total_unit_weight
  FROM inventory_item ii;
END;
$$;

-- Nightly inventory error checks
CREATE OR REPLACE FUNCTION get_nightly_inventory_errors()
RETURNS TABLE (
  error_type VARCHAR(50),
  inventory_item_id INTEGER,
  detail TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    'NEGATIVE_QUANTITY'::VARCHAR(50) AS error_type,
    ii.inventory_item_id,
    'quantity_available is below zero'::TEXT AS detail
  FROM inventory_item ii
  WHERE COALESCE(ii.quantity_available, 0) < 0

  UNION ALL

  SELECT
    'NEGATIVE_WEIGHT'::VARCHAR(50) AS error_type,
    ii.inventory_item_id,
    'unit_weight_available is below zero'::TEXT AS detail
  FROM inventory_item ii
  WHERE COALESCE(ii.unit_weight_available, 0) < 0

  UNION ALL

  SELECT
    'MISSING_SUPPLIER'::VARCHAR(50) AS error_type,
    ii.inventory_item_id,
    'supplier_id is null'::TEXT AS detail
  FROM inventory_item ii
  WHERE ii.supplier_id IS NULL

  UNION ALL

  SELECT
    'EXPIRED_STOCK'::VARCHAR(50) AS error_type,
    it.inventory_item_id,
    'inventory_transaction expiry_date is in the past'::TEXT AS detail
  FROM inventory_transaction it
  WHERE it.expiry_date IS NOT NULL
    AND it.expiry_date < CURRENT_TIMESTAMP;
END;
$$;

-- Add inventory type requirement to a menu item
CREATE OR REPLACE FUNCTION add_inventory_type_to_menu_item(
  p_menu_item_id INTEGER,
  p_inventory_item_id INTEGER,
  p_quantity_required DECIMAL(8, 4)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO inventory_menu_item (
    menu_item_id,
    inventory_item_id,
    quantity_required
  )
  VALUES (
    p_menu_item_id,
    p_inventory_item_id,
    p_quantity_required
  )
  ON CONFLICT (menu_item_id, inventory_item_id)
  DO UPDATE SET quantity_required = EXCLUDED.quantity_required;

  RETURN TRUE;
END;
$$;

-- Update inventory type requirement for a menu item
CREATE OR REPLACE FUNCTION update_inventory_type_requirement(
  p_menu_item_id INTEGER,
  p_inventory_item_id INTEGER,
  p_quantity_required DECIMAL(8, 4)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_updated INTEGER;
BEGIN
  UPDATE inventory_menu_item
  SET quantity_required = p_quantity_required
  WHERE menu_item_id = p_menu_item_id
    AND inventory_item_id = p_inventory_item_id;

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  RETURN v_rows_updated > 0;
END;
$$;

-- Remove inventory type requirement from a menu item
CREATE OR REPLACE FUNCTION remove_inventory_type_from_menu_item(
  p_menu_item_id INTEGER,
  p_inventory_item_id INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_deleted INTEGER;
BEGIN
  DELETE FROM inventory_menu_item
  WHERE menu_item_id = p_menu_item_id
    AND inventory_item_id = p_inventory_item_id;

  GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
  RETURN v_rows_deleted > 0;
END;
$$;

-- Fetch inventory types linked to a menu item
CREATE OR REPLACE FUNCTION get_inventory_types_for_menu_item(p_menu_item_id INTEGER)
RETURNS TABLE (
  menu_item_id INTEGER,
  inventory_item_id INTEGER,
  supplier_id INTEGER,
  supplier_name VARCHAR(50),
  quantity_required DECIMAL(8, 4),
  quantity_available SMALLINT,
  unit_weight_available DECIMAL(8, 4)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    imi.menu_item_id,
    imi.inventory_item_id,
    ii.supplier_id,
    s.supplier_name,
    imi.quantity_required,
    ii.quantity_available,
    ii.unit_weight_available
  FROM inventory_menu_item imi
  JOIN inventory_item ii ON ii.inventory_item_id = imi.inventory_item_id
  LEFT JOIN supplier s ON s.supplier_id = ii.supplier_id
  WHERE imi.menu_item_id = p_menu_item_id
  ORDER BY imi.inventory_item_id;
END;
$$;
