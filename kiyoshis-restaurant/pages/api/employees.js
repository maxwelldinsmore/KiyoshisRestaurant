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
    console.error('Employees API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function handleGet(req, res) {
  const { employee_id: employeeId } = req.query;

  if (employeeId) {
    const data = await sql`SELECT * FROM get_employee_by_id(${Number(employeeId)})`;
    return res.status(200).json({ success: true, count: data.length, data });
  }

  const data = await sql`SELECT * FROM get_all_employees()`;
  return res.status(200).json({ success: true, count: data.length, data });
}

async function handlePost(req, res) {
  const {
    employee_first_name: firstName,
    employee_last_name: lastName,
    employee_phone_number: phoneNumber,
  } = req.body;

  const data = await sql`
    SELECT create_employee(
      ${firstName ?? null},
      ${lastName ?? null},
      ${phoneNumber ?? null}
    ) AS employee_id
  `;

  return res.status(201).json({ success: true, data: data[0] });
}

async function handlePut(req, res) {
  const {
    employee_id: employeeId,
    employee_first_name: firstName,
    employee_last_name: lastName,
    employee_phone_number: phoneNumber,
  } = req.body;

  if (!employeeId) {
    return res.status(400).json({ success: false, error: 'employee_id is required' });
  }

  const data = await sql`
    SELECT update_employee(
      ${Number(employeeId)},
      ${firstName ?? null},
      ${lastName ?? null},
      ${phoneNumber ?? null}
    ) AS updated
  `;

  return res.status(200).json({ success: true, data: data[0] });
}

async function handleDelete(req, res) {
  const { employee_id: employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ success: false, error: 'employee_id is required' });
  }

  const data = await sql`SELECT delete_employee(${Number(employeeId)}) AS deleted`;
  return res.status(200).json({ success: true, data: data[0] });
}
