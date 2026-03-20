import sql from './db';

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Menu Items API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function handleGet(req, res) {
  const { menu_item_id: menuItemId } = req.query;

  if (menuItemId) {
    const data = await sql`SELECT * FROM get_menu_item_by_id(${Number(menuItemId)})`;
    return res.status(200).json({ success: true, count: data.length, data });
  }

  const data = await sql`SELECT * FROM get_all_menu_items()`;
  return res.status(200).json({ success: true, count: data.length, data });
}

async function handlePost(req, res) {
  const { action } = req.body ?? {};

  if (action === 'refresh_all_availability') {
    const data = await sql`SELECT refresh_all_menu_item_availability() AS updated_count`;
    return res.status(200).json({ success: true, data: data[0] });
  }

  const {
    category_id: categoryId,
    menu_item_name: name,
    menu_item_price: price,
    menu_item_description: description,
    is_item_available: isAvailable,
    menu_item_discount_percent: discountPercent,
    menu_item_asset_path: assetPath,
  } = req.body;

  const data = await sql`
    SELECT create_menu_item(
      ${categoryId ?? null},
      ${name ?? null},
      ${price ?? null},
      ${description ?? null},
      ${isAvailable ?? true},
      ${discountPercent ?? 0},
      ${assetPath ?? null}
    ) AS menu_item_id
  `;

  return res.status(201).json({ success: true, data: data[0] });
}

async function handlePut(req, res) {
  const { action } = req.body ?? {};

  if (action === 'set_availability_manual') {
    const { menu_item_id: menuItemId, is_item_available: isAvailable } = req.body;

    if (!menuItemId) {
      return res.status(400).json({ success: false, error: 'menu_item_id is required' });
    }

    const data = await sql`
      SELECT set_menu_item_availability_manual(${Number(menuItemId)}, ${Boolean(isAvailable)}) AS updated
    `;
    return res.status(200).json({ success: true, data: data[0] });
  }

  if (action === 'refresh_availability') {
    const { menu_item_id: menuItemId } = req.body;

    if (!menuItemId) {
      return res.status(400).json({ success: false, error: 'menu_item_id is required' });
    }

    const data = await sql`
      SELECT refresh_menu_item_availability(${Number(menuItemId)}) AS updated
    `;
    return res.status(200).json({ success: true, data: data[0] });
  }

  const {
    menu_item_id: menuItemId,
    category_id: categoryId,
    menu_item_name: name,
    menu_item_price: price,
    menu_item_description: description,
    menu_item_discount_percent: discountPercent,
    menu_item_asset_path: assetPath,
  } = req.body;

  if (!menuItemId) {
    return res.status(400).json({ success: false, error: 'menu_item_id is required' });
  }

  const data = await sql`
    SELECT update_menu_item(
      ${Number(menuItemId)},
      ${categoryId ?? null},
      ${name ?? null},
      ${price ?? null},
      ${description ?? null},
      ${discountPercent ?? null},
      ${assetPath ?? null}
    ) AS updated
  `;

  return res.status(200).json({ success: true, data: data[0] });
}

async function handleDelete(req, res) {
  const { menu_item_id: menuItemId } = req.body;

  if (!menuItemId) {
    return res.status(400).json({ success: false, error: 'menu_item_id is required' });
  }

  const data = await sql`SELECT delete_menu_item(${Number(menuItemId)}) AS deleted`;
  return res.status(200).json({ success: true, data: data[0] });
}
