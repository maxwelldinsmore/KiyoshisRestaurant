/*
  Functions file
  Domain: Suppliers
  Desc: CRUD operations for supplier records.
*/

-- Create supplier
CREATE OR REPLACE FUNCTION create_supplier(
  p_supplier_name VARCHAR(50), p_supplier_email VARCHAR(80),
  p_supplier_phonenumber VARCHAR(10), p_supplier_notes TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_supplier_id INTEGER;
BEGIN
  INSERT INTO supplier (
    supplier_name, supplier_email,
    supplier_phonenumber, supplier_notes
  )
  VALUES (
    p_supplier_name, p_supplier_email,
    p_supplier_phonenumber, p_supplier_notes
  )
  RETURNING supplier_id INTO v_supplier_id;

  RETURN v_supplier_id;
END;
$$;

-- Fetch one supplier
CREATE OR REPLACE FUNCTION get_supplier_by_id(p_supplier_id INTEGER)
RETURNS TABLE (
  supplier_id INTEGER, supplier_name VARCHAR(50),
  supplier_email VARCHAR(80), supplier_phonenumber VARCHAR(10),
  supplier_notes TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.supplier_id, s.supplier_name, s.supplier_email,
    s.supplier_phonenumber, s.supplier_notes
  FROM supplier s
  WHERE s.supplier_id = p_supplier_id;
END;
$$;

-- Fetch all suppliers
CREATE OR REPLACE FUNCTION get_all_suppliers()
RETURNS TABLE (
  supplier_id INTEGER, supplier_name VARCHAR(50),
  supplier_email VARCHAR(80), supplier_phonenumber VARCHAR(10),
  supplier_notes TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.supplier_id, s.supplier_name,
    s.supplier_email, s.supplier_phonenumber,
    s.supplier_notes
  FROM supplier s
  ORDER BY s.supplier_id;
END;
$$;

-- Update supplier
CREATE OR REPLACE FUNCTION update_supplier(
  p_supplier_id INTEGER, p_supplier_name VARCHAR(50) DEFAULT NULL,
  p_supplier_email VARCHAR(80) DEFAULT NULL, p_supplier_phonenumber VARCHAR(10) DEFAULT NULL,
  p_supplier_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_updated INTEGER;
BEGIN
  UPDATE supplier
  SET
    supplier_name = COALESCE(p_supplier_name, supplier_name),
    supplier_email = COALESCE(p_supplier_email, supplier_email),
    supplier_phonenumber = COALESCE(p_supplier_phonenumber, supplier_phonenumber),
    supplier_notes = COALESCE(p_supplier_notes, supplier_notes)
  WHERE supplier_id = p_supplier_id;

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  RETURN v_rows_updated > 0;
END;
$$;

-- Delete supplier
CREATE OR REPLACE FUNCTION delete_supplier(p_supplier_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_deleted INTEGER;
BEGIN
  UPDATE inventory_item
  SET supplier_id = NULL
  WHERE supplier_id = p_supplier_id;

  DELETE FROM supplier
  WHERE supplier_id = p_supplier_id;

  GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
  RETURN v_rows_deleted > 0;
END;
$$;
