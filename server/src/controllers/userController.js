const pool = require('../config/database');

exports.getMe = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.headline, u.bio, u.location, u.created_at,
       COALESCE(array_agg(s.name) FILTER (WHERE s.name IS NOT NULL), '{}') AS skills
       FROM users u LEFT JOIN user_skills us ON us.user_id=u.id LEFT JOIN skills s ON s.id=us.skill_id
       WHERE u.id=$1 GROUP BY u.id`,
      [req.user.id],
    );
    res.json(result.rows[0]);
  } catch (error) { next(error); }
};

exports.updateMe = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { name, headline, bio, location, skills } = req.body;
    await client.query('BEGIN');
    await client.query(
      `UPDATE users SET name = COALESCE($1, name), headline = COALESCE($2, headline), bio = COALESCE($3, bio), location = COALESCE($4, location), updated_at = NOW()
       WHERE id = $5`,
      [name, headline, bio, location, req.user.id],
    );
    if (skills !== undefined) {
      const normalized = [...new Set((Array.isArray(skills) ? skills : String(skills).split(','))
        .map((skill) => skill.trim()).filter(Boolean).slice(0, 30))];
      await client.query('DELETE FROM user_skills WHERE user_id=$1', [req.user.id]);
      for (const skillName of normalized) {
        const skill = await client.query(
          'INSERT INTO skills (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id',
          [skillName],
        );
        await client.query('INSERT INTO user_skills (user_id,skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [req.user.id, skill.rows[0].id]);
      }
    }
    const result = await client.query(
      `SELECT u.id,u.name,u.email,u.role,u.headline,u.bio,u.location,
       COALESCE(array_agg(s.name) FILTER (WHERE s.name IS NOT NULL), '{}') AS skills
       FROM users u LEFT JOIN user_skills us ON us.user_id=u.id LEFT JOIN skills s ON s.id=us.skill_id
       WHERE u.id=$1 GROUP BY u.id`, [req.user.id],
    );
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) { await client.query('ROLLBACK'); next(error); }
  finally { client.release(); }
};
