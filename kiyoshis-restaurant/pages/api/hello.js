
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sql from './db';

export default async function handler( req,res) {
  try {
    // Simple query to test connection
    const result = await sql`SELECT NOW() as current_time, version() as postgres_version`;
    
    res.status(200).json({ 
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed' 
    });
  }
}


