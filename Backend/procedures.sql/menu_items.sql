/*
  Functions file
  Domain: Menu Items
  Desc: CRUD plus manual/automatic availability updates.
*/

-- Create menu item
CREATE OR REPLACE FUNCTION create_menu_item(
  p_category_id INTEGER,
  p_menu_item_name VARCHAR(100),
  p_menu_item_price DECIMAL(7, 2),
  p_menu_item_description VARCHAR(140),
  p_is_item_available BOOLEAN DEFAULT TRUE,
  p_menu_item_discount_percent DECIMAL(5, 2) DEFAULT 0.00,
  p_menu_item_asset_path VARCHAR(140) DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_menu_item_id INTEGER;
BEGIN
  INSERT INTO menu_item (
    category_id,
    menu_item_name,
    menu_item_price,
    menu_item_description,
    is_item_available,
    menu_item_discount_percent,
    menu_item_asset_path
  )
  VALUES (
    p_category_id,
    p_menu_item_name,
    p_menu_item_price,
    p_menu_item_description,
    p_is_item_available,
    p_menu_item_discount_percent,
    p_menu_item_asset_path
  )
  RETURNING menu_item_id INTO v_menu_item_id;

  RETURN v_menu_item_id;
END;
$$;

-- Fetch one menu item
CREATE OR REPLACE FUNCTION get_menu_item_by_id(p_menu_item_id INTEGER)
RETURNS TABLE (
  menu_item_id INTEGER,
  category_id INTEGER,
  category_definition VARCHAR(20),
  menu_item_name VARCHAR(100),
  menu_item_price DECIMAL(7, 2),
  menu_item_description VARCHAR(140),
  is_item_available BOOLEAN,
  menu_item_discount_percent DECIMAL(5, 2),
  menu_item_asset_path VARCHAR(140)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    mi.menu_item_id,
    mi.category_id,
    c.category_definition,
    mi.menu_item_name,
    mi.menu_item_price,
    mi.menu_item_description,
    mi.is_item_available,
    mi.menu_item_discount_percent,
    mi.menu_item_asset_path
  FROM menu_item mi
  LEFT JOIN category c ON c.category_id = mi.category_id
  WHERE mi.menu_item_id = p_menu_item_id;
END;
$$;

-- Fetch all menu items
CREATE OR REPLACE FUNCTION get_all_menu_items()
RETURNS TABLE (
  menu_item_id INTEGER,
  category_id INTEGER,
  category_definition VARCHAR(20),
  menu_item_name VARCHAR(100),
  menu_item_price DECIMAL(7, 2),
  menu_item_description VARCHAR(140),
  is_item_available BOOLEAN,
  menu_item_discount_percent DECIMAL(5, 2),
  menu_item_asset_path VARCHAR(140)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    mi.menu_item_id,
    mi.category_id,
    c.category_definition,
    mi.menu_item_name,
    mi.menu_item_price,
    mi.menu_item_description,
    mi.is_item_available,
    mi.menu_item_discount_percent,
    mi.menu_item_asset_path
  FROM menu_item mi
  LEFT JOIN category c ON c.category_id = mi.category_id
  ORDER BY mi.menu_item_id;
END;
$$;

-- Update menu item
CREATE OR REPLACE FUNCTION update_menu_item(
  p_menu_item_id INTEGER,
  p_category_id INTEGER DEFAULT NULL,
  p_menu_item_name VARCHAR(100) DEFAULT NULL,
  p_menu_item_price DECIMAL(7, 2) DEFAULT NULL,
  p_menu_item_description VARCHAR(140) DEFAULT NULL,
  p_menu_item_discount_percent DECIMAL(5, 2) DEFAULT NULL,
  p_menu_item_asset_path VARCHAR(140) DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_updated INTEGER;
BEGIN
  UPDATE menu_item
  SET
    category_id = COALESCE(p_category_id, category_id),
    menu_item_name = COALESCE(p_menu_item_name, menu_item_name),
    menu_item_price = COALESCE(p_menu_item_price, menu_item_price),
    menu_item_description = COALESCE(p_menu_item_description, menu_item_description),
    menu_item_discount_percent = COALESCE(p_menu_item_discount_percent, menu_item_discount_percent),
    menu_item_asset_path = COALESCE(p_menu_item_asset_path, menu_item_asset_path)
  WHERE menu_item_id = p_menu_item_id;

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  RETURN v_rows_updated > 0;
END;
$$;

-- Delete menu item
CREATE OR REPLACE FUNCTION delete_menu_item(p_menu_item_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_deleted INTEGER;
BEGIN
  DELETE FROM customer_preference
  WHERE menu_item_id = p_menu_item_id;

  DELETE FROM inventory_menu_item
  WHERE menu_item_id = p_menu_item_id;

  DELETE FROM order_item
  WHERE menu_item_id = p_menu_item_id;

  UPDATE rewards
  SET menu_item_id = NULL
  WHERE menu_item_id = p_menu_item_id;

  DELETE FROM menu_item
  WHERE menu_item_id = p_menu_item_id;

  GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
  RETURN v_rows_deleted > 0;
END;
$$;

-- Manual availability update
CREATE OR REPLACE FUNCTION set_menu_item_availability_manual(
  p_menu_item_id INTEGER,
  p_is_item_available BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_updated INTEGER;
BEGIN
  UPDATE menu_item
  SET is_item_available = p_is_item_available
  WHERE menu_item_id = p_menu_item_id;

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  RETURN v_rows_updated > 0;
END;
$$;

-- Auto availability update for one menu item based on current inventory
CREATE OR REPLACE FUNCTION refresh_menu_item_availability(p_menu_item_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_updated INTEGER;
BEGIN
  UPDATE menu_item mi
  SET is_item_available = NOT EXISTS (
    SELECT 1
    FROM inventory_menu_item imi
    LEFT JOIN inventory_item ii
      ON ii.inventory_item_id = imi.inventory_item_id
    WHERE imi.menu_item_id = mi.menu_item_id
      AND (
        ii.inventory_item_id IS NULL
        OR COALESCE(ii.quantity_available, 0)::DECIMAL(8, 4) < COALESCE(imi.quantity_required, 0)
      )
  )
  WHERE mi.menu_item_id = p_menu_item_id;

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  RETURN v_rows_updated > 0;
END;
$$;

-- Auto availability update for all menu items
CREATE OR REPLACE FUNCTION refresh_all_menu_item_availability()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_updated INTEGER;
BEGIN
  UPDATE menu_item mi
  SET is_item_available = NOT EXISTS (
    SELECT 1
    FROM inventory_menu_item imi
    LEFT JOIN inventory_item ii
      ON ii.inventory_item_id = imi.inventory_item_id
    WHERE imi.menu_item_id = mi.menu_item_id
      AND (
        ii.inventory_item_id IS NULL
        OR COALESCE(ii.quantity_available, 0)::DECIMAL(8, 4) < COALESCE(imi.quantity_required, 0)
      )
  );

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  RETURN v_rows_updated;
END;
$$;

-- Trigger helper: refresh affected menu items when inventory changes
CREATE OR REPLACE FUNCTION trg_refresh_menu_item_availability_on_inventory_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM refresh_menu_item_availability(imi.menu_item_id)
    FROM inventory_menu_item imi
    WHERE imi.inventory_item_id = OLD.inventory_item_id;
  ELSE
    PERFORM refresh_menu_item_availability(imi.menu_item_id)
    FROM inventory_menu_item imi
    WHERE imi.inventory_item_id = NEW.inventory_item_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger helper: refresh one menu item when ingredient mapping changes
CREATE OR REPLACE FUNCTION trg_refresh_menu_item_availability_on_mapping_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM refresh_menu_item_availability(COALESCE(NEW.menu_item_id, OLD.menu_item_id));
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS inventory_item_refresh_menu_item_availability ON inventory_item;
CREATE TRIGGER inventory_item_refresh_menu_item_availability
AFTER INSERT OR UPDATE OR DELETE ON inventory_item
FOR EACH ROW
EXECUTE FUNCTION trg_refresh_menu_item_availability_on_inventory_change();

DROP TRIGGER IF EXISTS inventory_menu_item_refresh_menu_item_availability ON inventory_menu_item;
CREATE TRIGGER inventory_menu_item_refresh_menu_item_availability
AFTER INSERT OR UPDATE OR DELETE ON inventory_menu_item
FOR EACH ROW
EXECUTE FUNCTION trg_refresh_menu_item_availability_on_mapping_change();
