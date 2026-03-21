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
    console.error('Inventory API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function handleGet(req, res) {
  const {
    inventory_item_id: inventoryItemId,
    menu_item_id: menuItemId,
    summary,
    report,
  } = req.query;

  if (summary === 'total') {
    const data = await sql`SELECT * FROM get_total_inventory()`;
    return res.status(200).json({ success: true, count: data.length, data });
  }

  if (report === 'nightly_errors') {
    const data = await sql`SELECT * FROM get_nightly_inventory_errors()`;
    return res.status(200).json({ success: true, count: data.length, data });
  }

  if (menuItemId) {
    const data = await sql`SELECT * FROM get_inventory_types_for_menu_item(${Number(menuItemId)})`;
    return res.status(200).json({ success: true, count: data.length, data });
  }

  if (inventoryItemId) {
    const data = await sql`SELECT * FROM get_inventory_item_by_id(${Number(inventoryItemId)})`;
    return res.status(200).json({ success: true, count: data.length, data });
  }

  const data = await sql`SELECT * FROM get_all_inventory_items()`;
  return res.status(200).json({ success: true, count: data.length, data });
}

async function handlePost(req, res) {
  const { action } = req.body ?? {};

  if (action === 'link_menu_item') {
    const {
      menu_item_id: menuItemId,
      inventory_item_id: inventoryItemId,
      quantity_required: quantityRequired,
    } = req.body;

    const data = await sql`
      SELECT add_inventory_type_to_menu_item(
        ${Number(menuItemId)},
        ${Number(inventoryItemId)},
        ${quantityRequired ?? null}
      ) AS linked
    `;

    return res.status(201).json({ success: true, data: data[0] });
  }

  const {
    supplier_id: supplierId,
    purchase_date: purchaseDate,
    quantity_available: quantityAvailable,
    unit_weight_available: unitWeightAvailable,
  } = req.body;

  const data = await sql`
    SELECT create_inventory_item(
      ${supplierId ?? null},
      ${purchaseDate ?? null},
      ${quantityAvailable ?? null},
      ${unitWeightAvailable ?? null}
    ) AS inventory_item_id
  `;

  return res.status(201).json({ success: true, data: data[0] });
}

async function handlePut(req, res) {
  const { action } = req.body ?? {};

  if (action === 'link_menu_item') {
    const {
      menu_item_id: menuItemId,
      inventory_item_id: inventoryItemId,
      quantity_required: quantityRequired,
    } = req.body;

    const data = await sql`
      SELECT update_inventory_type_requirement(
        ${Number(menuItemId)},
        ${Number(inventoryItemId)},
        ${quantityRequired ?? null}
      ) AS updated
    `;

    return res.status(200).json({ success: true, data: data[0] });
  }

  const {
    inventory_item_id: inventoryItemId,
    supplier_id: supplierId,
    purchase_date: purchaseDate,
    quantity_available: quantityAvailable,
    unit_weight_available: unitWeightAvailable,
  } = req.body;

  if (!inventoryItemId) {
    return res.status(400).json({ success: false, error: 'inventory_item_id is required' });
  }

  const data = await sql`
    SELECT update_inventory_item(
      ${Number(inventoryItemId)},
      ${supplierId ?? null},
      ${purchaseDate ?? null},
      ${quantityAvailable ?? null},
      ${unitWeightAvailable ?? null}
    ) AS updated
  `;

  return res.status(200).json({ success: true, data: data[0] });
}

async function handleDelete(req, res) {
  const { action } = req.body ?? {};

  if (action === 'link_menu_item') {
    const {
      menu_item_id: menuItemId,
      inventory_item_id: inventoryItemId,
    } = req.body;

    const data = await sql`
      SELECT remove_inventory_type_from_menu_item(${Number(menuItemId)}, ${Number(inventoryItemId)}) AS deleted
    `;

    return res.status(200).json({ success: true, data: data[0] });
  }

  const { inventory_item_id: inventoryItemId } = req.body;

  if (!inventoryItemId) {
    return res.status(400).json({ success: false, error: 'inventory_item_id is required' });
  }

  const data = await sql`SELECT delete_inventory_item(${Number(inventoryItemId)}) AS deleted`;
  return res.status(200).json({ success: true, data: data[0] });
}
