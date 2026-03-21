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
    console.error('Suppliers API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function handleGet(req, res) {
  const { supplier_id: supplierId } = req.query;

  if (supplierId) {
    const data = await sql`SELECT * FROM get_supplier_by_id(${Number(supplierId)})`;
    return res.status(200).json({ success: true, count: data.length, data });
  }

  const data = await sql`SELECT * FROM get_all_suppliers()`;
  return res.status(200).json({ success: true, count: data.length, data });
}

async function handlePost(req, res) {
  const {
    supplier_name: supplierName,
    supplier_email: supplierEmail,
    supplier_phonenumber: supplierPhone,
    supplier_notes: supplierNotes,
  } = req.body;

  const data = await sql`
    SELECT create_supplier(
      ${supplierName ?? null},
      ${supplierEmail ?? null},
      ${supplierPhone ?? null},
      ${supplierNotes ?? null}
    ) AS supplier_id
  `;

  return res.status(201).json({ success: true, data: data[0] });
}

async function handlePut(req, res) {
  const {
    supplier_id: supplierId,
    supplier_name: supplierName,
    supplier_email: supplierEmail,
    supplier_phonenumber: supplierPhone,
    supplier_notes: supplierNotes,
  } = req.body;

  if (!supplierId) {
    return res.status(400).json({ success: false, error: 'supplier_id is required' });
  }

  const data = await sql`
    SELECT update_supplier(
      ${Number(supplierId)},
      ${supplierName ?? null},
      ${supplierEmail ?? null},
      ${supplierPhone ?? null},
      ${supplierNotes ?? null}
    ) AS updated
  `;

  return res.status(200).json({ success: true, data: data[0] });
}

async function handleDelete(req, res) {
  const { supplier_id: supplierId } = req.body;

  if (!supplierId) {
    return res.status(400).json({ success: false, error: 'supplier_id is required' });
  }

  const data = await sql`SELECT delete_supplier(${Number(supplierId)}) AS deleted`;
  return res.status(200).json({ success: true, data: data[0] });
}
