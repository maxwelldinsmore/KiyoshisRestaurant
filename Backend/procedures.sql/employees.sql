/*
  Functions file
  Domain: Employees
  Desc: CRUD operations for employee records.
*/

-- Create employee
CREATE OR REPLACE FUNCTION create_employee(
  p_employee_first_name VARCHAR(30),
  p_employee_last_name VARCHAR(30),
  p_employee_phone_number VARCHAR(10)
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_employee_id INTEGER;
BEGIN
  INSERT INTO employee (
    employee_first_name,
    employee_last_name,
    employee_phone_number
  )
  VALUES (
    p_employee_first_name,
    p_employee_last_name,
    p_employee_phone_number
  )
  RETURNING employee_id INTO v_employee_id;

  RETURN v_employee_id;
END;
$$;

-- Fetch one employee
CREATE OR REPLACE FUNCTION get_employee_by_id(p_employee_id INTEGER)
RETURNS TABLE (
  employee_id INTEGER,
  employee_first_name VARCHAR(30),
  employee_last_name VARCHAR(30),
  employee_phone_number VARCHAR(10)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.employee_id,
    e.employee_first_name,
    e.employee_last_name,
    e.employee_phone_number
  FROM employee e
  WHERE e.employee_id = p_employee_id;
END;
$$;

-- Fetch all employees
CREATE OR REPLACE FUNCTION get_all_employees()
RETURNS TABLE (
  employee_id INTEGER,
  employee_first_name VARCHAR(30),
  employee_last_name VARCHAR(30),
  employee_phone_number VARCHAR(10)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.employee_id,
    e.employee_first_name,
    e.employee_last_name,
    e.employee_phone_number
  FROM employee e
  ORDER BY e.employee_id;
END;
$$;

-- Update employee
CREATE OR REPLACE FUNCTION update_employee(
  p_employee_id INTEGER,
  p_employee_first_name VARCHAR(30) DEFAULT NULL,
  p_employee_last_name VARCHAR(30) DEFAULT NULL,
  p_employee_phone_number VARCHAR(10) DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_updated INTEGER;
BEGIN
  UPDATE employee
  SET
    employee_first_name = COALESCE(p_employee_first_name, employee_first_name),
    employee_last_name = COALESCE(p_employee_last_name, employee_last_name),
    employee_phone_number = COALESCE(p_employee_phone_number, employee_phone_number)
  WHERE employee_id = p_employee_id;

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  RETURN v_rows_updated > 0;
END;
$$;

-- Delete employee
CREATE OR REPLACE FUNCTION delete_employee(p_employee_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_deleted INTEGER;
BEGIN
  UPDATE orders
  SET employee_id = NULL
  WHERE employee_id = p_employee_id;

  DELETE FROM employee
  WHERE employee_id = p_employee_id;

  GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
  RETURN v_rows_deleted > 0;
END;
$$;
