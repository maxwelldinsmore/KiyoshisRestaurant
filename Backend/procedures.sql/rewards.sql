/*
  Functions file
  Domain: Rewards
  Desc: Reward reads and reward option updates.
*/

-- Create reward option
CREATE OR REPLACE FUNCTION create_reward(
  p_menu_item_id INTEGER,
  p_required_visits SMALLINT
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_reward_id INTEGER;
BEGIN
  INSERT INTO rewards (
    menu_item_id,
    required_visits
  )
  VALUES (
    p_menu_item_id,
    p_required_visits
  )
  RETURNING reward_id INTO v_reward_id;

  RETURN v_reward_id;
END;
$$;

-- Fetch one reward option
CREATE OR REPLACE FUNCTION get_reward_by_id(p_reward_id INTEGER)
RETURNS TABLE (
  reward_id INTEGER,
  menu_item_id INTEGER,
  menu_item_name VARCHAR(100),
  required_visits SMALLINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.reward_id,
    r.menu_item_id,
    mi.menu_item_name,
    r.required_visits
  FROM rewards r
  LEFT JOIN menu_item mi ON mi.menu_item_id = r.menu_item_id
  WHERE r.reward_id = p_reward_id;
END;
$$;

-- Fetch all reward options
CREATE OR REPLACE FUNCTION get_all_rewards()
RETURNS TABLE (
  reward_id INTEGER,
  menu_item_id INTEGER,
  menu_item_name VARCHAR(100),
  required_visits SMALLINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.reward_id,
    r.menu_item_id,
    mi.menu_item_name,
    r.required_visits
  FROM rewards r
  LEFT JOIN menu_item mi ON mi.menu_item_id = r.menu_item_id
  ORDER BY r.reward_id;
END;
$$;

-- Update reward option
CREATE OR REPLACE FUNCTION update_reward_option(
  p_reward_id INTEGER,
  p_menu_item_id INTEGER DEFAULT NULL,
  p_required_visits SMALLINT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_updated INTEGER;
BEGIN
  UPDATE rewards
  SET
    menu_item_id = COALESCE(p_menu_item_id, menu_item_id),
    required_visits = COALESCE(p_required_visits, required_visits)
  WHERE reward_id = p_reward_id;

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  RETURN v_rows_updated > 0;
END;
$$;

-- Delete reward option
CREATE OR REPLACE FUNCTION delete_reward(p_reward_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows_deleted INTEGER;
BEGIN
  DELETE FROM rewards_redemption
  WHERE reward_id = p_reward_id;

  DELETE FROM rewards
  WHERE reward_id = p_reward_id;

  GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
  RETURN v_rows_deleted > 0;
END;
$$;
