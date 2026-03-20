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
    console.error('Rewards API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function handleGet(req, res) {
  const { reward_id: rewardId } = req.query;

  if (rewardId) {
    const data = await sql`SELECT * FROM get_reward_by_id(${Number(rewardId)})`;
    return res.status(200).json({ success: true, count: data.length, data });
  }

  const data = await sql`SELECT * FROM get_all_rewards()`;
  return res.status(200).json({ success: true, count: data.length, data });
}

async function handlePost(req, res) {
  const {
    menu_item_id: menuItemId,
    required_visits: requiredVisits,
  } = req.body;

  const data = await sql`
    SELECT create_reward(${menuItemId ?? null}, ${requiredVisits ?? null}) AS reward_id
  `;

  return res.status(201).json({ success: true, data: data[0] });
}

async function handlePut(req, res) {
  const {
    reward_id: rewardId,
    menu_item_id: menuItemId,
    required_visits: requiredVisits,
  } = req.body;

  if (!rewardId) {
    return res.status(400).json({ success: false, error: 'reward_id is required' });
  }

  const data = await sql`
    SELECT update_reward_option(
      ${Number(rewardId)},
      ${menuItemId ?? null},
      ${requiredVisits ?? null}
    ) AS updated
  `;

  return res.status(200).json({ success: true, data: data[0] });
}

async function handleDelete(req, res) {
  const { reward_id: rewardId } = req.body;

  if (!rewardId) {
    return res.status(400).json({ success: false, error: 'reward_id is required' });
  }

  const data = await sql`SELECT delete_reward(${Number(rewardId)}) AS deleted`;
  return res.status(200).json({ success: true, data: data[0] });
}
