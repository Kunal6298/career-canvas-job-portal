const pool = require('../config/database');

async function replaceJobSkills(client, jobId, skills = []) {
  // Form input can arrive either as an array or as comma-separated text.
  const normalized = [...new Set((Array.isArray(skills) ? skills : String(skills).split(','))
    .map((skill) => skill.trim()).filter(Boolean).slice(0, 20))];
  await client.query('DELETE FROM job_skills WHERE job_id = $1', [jobId]);
  for (const name of normalized) {
    const skill = await client.query(
      'INSERT INTO skills (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
      [name],
    );
    await client.query('INSERT INTO job_skills (job_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [jobId, skill.rows[0].id]);
  }
}

exports.list = async (req, res, next) => {
  try {
    const search = `%${req.query.search || ''}%`;
    const result = await pool.query(
      `SELECT j.*, u.name AS recruiter_name,
              COALESCE(array_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '{}') AS skills
       FROM jobs j JOIN users u ON u.id = j.recruiter_id
       LEFT JOIN job_skills js ON js.job_id = j.id LEFT JOIN skills s ON s.id = js.skill_id
       WHERE j.is_active = TRUE AND (j.title ILIKE $1 OR j.company_name ILIKE $1 OR j.description ILIKE $1)
       AND ($2 = '' OR j.location ILIKE $2) AND ($3 = '' OR j.employment_type = $3)
       GROUP BY j.id, u.name ORDER BY j.created_at DESC`,
      [search, req.query.location ? `%${req.query.location}%` : '', req.query.type || ''],
    );
    res.json({ jobs: result.rows });
  } catch (error) { next(error); }
};

exports.getOne = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT j.*, COALESCE(array_agg(s.name) FILTER (WHERE s.name IS NOT NULL), '{}') AS skills
       FROM jobs j LEFT JOIN job_skills js ON js.job_id = j.id LEFT JOIN skills s ON s.id = js.skill_id
       WHERE j.id = $1 AND j.is_active = TRUE GROUP BY j.id`,
      [req.params.id],
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Job not found.' });
    res.json(result.rows[0]);
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { title, companyName, location, employmentType, description, requirements, salaryMin, salaryMax, skills } = req.body;
    if (!title || !companyName || !description) return res.status(400).json({ message: 'Title, company, and description are required.' });
    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO jobs (recruiter_id, title, company_name, location, employment_type, description, requirements, salary_min, salary_max)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.user.id, title, companyName, location || null, employmentType || 'Full-time', description, requirements || null, salaryMin || null, salaryMax || null],
    );
    await replaceJobSkills(client, result.rows[0].id, skills);
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) { await client.query('ROLLBACK'); next(error); }
  finally { client.release(); }
};

exports.mine = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT j.*, COUNT(a.id)::int AS application_count FROM jobs j
       LEFT JOIN applications a ON a.job_id = j.id WHERE j.recruiter_id = $1
       GROUP BY j.id ORDER BY j.created_at DESC`,
      [req.user.id],
    );
    res.json({ jobs: result.rows });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { title, companyName, location, employmentType, description, requirements, salaryMin, salaryMax, skills, isActive } = req.body;
    const result = await client.query(
      `UPDATE jobs SET title=COALESCE($1,title), company_name=COALESCE($2,company_name), location=COALESCE($3,location),
       employment_type=COALESCE($4,employment_type), description=COALESCE($5,description), requirements=COALESCE($6,requirements),
       salary_min=COALESCE($7,salary_min), salary_max=COALESCE($8,salary_max), is_active=COALESCE($9,is_active), updated_at=NOW()
       WHERE id=$10 AND recruiter_id=$11 RETURNING *`,
      [title, companyName, location, employmentType, description, requirements, salaryMin, salaryMax, isActive, req.params.id, req.user.id],
    );
    if (!result.rows[0]) { await client.query('ROLLBACK'); return res.status(404).json({ message: 'Job not found.' }); }
    if (skills !== undefined) await replaceJobSkills(client, req.params.id, skills);
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) { await client.query('ROLLBACK'); next(error); }
  finally { client.release(); }
};

exports.recommended = async (req, res, next) => {
  try {
    // The score is the percentage of required job skills found in the
    // current seeker's profile. Jobs without listed skills receive zero.
    const result = await pool.query(
      `SELECT j.*, COALESCE(array_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '{}') AS skills,
       CASE WHEN COUNT(DISTINCT js.skill_id) = 0 THEN 0 ELSE
         ROUND(100.0 * COUNT(DISTINCT us.skill_id) / COUNT(DISTINCT js.skill_id))::int END AS match_score
       FROM jobs j LEFT JOIN job_skills js ON js.job_id = j.id LEFT JOIN skills s ON s.id = js.skill_id
       LEFT JOIN user_skills us ON us.skill_id = js.skill_id AND us.user_id = $1
       WHERE j.is_active = TRUE GROUP BY j.id ORDER BY match_score DESC, j.created_at DESC`,
      [req.user.id],
    );
    res.json({ jobs: result.rows });
  } catch (error) { next(error); }
};
