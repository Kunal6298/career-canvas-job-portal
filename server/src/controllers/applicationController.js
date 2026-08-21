const pool = require('../config/database');

exports.create = async (req, res, next) => {
  try {
    if (!req.body.jobId) return res.status(400).json({ message: 'A job is required.' });
    if (!req.file) return res.status(400).json({ message: 'Please attach your resume.' });
    const result = await pool.query(
      `INSERT INTO applications (job_id, applicant_id, resume_name, resume_mime, resume_data)
       VALUES ($1,$2,$3,$4,$5) RETURNING id, job_id, applicant_id, status, created_at`,
      [req.body.jobId, req.user.id, req.file.originalname, req.file.mimetype, req.file.buffer],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { next(error); }
};

exports.myApplications = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT a.*, j.title, j.company_name FROM applications a JOIN jobs j ON j.id = a.job_id
       WHERE a.applicant_id = $1 ORDER BY a.created_at DESC`,
      [req.user.id],
    );
    res.json({ applications: result.rows });
  } catch (error) { next(error); }
};

exports.recruiterApplications = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.job_id, a.applicant_id, a.status, a.resume_name, a.created_at,
              j.title, u.name AS applicant_name, u.email AS applicant_email
       FROM applications a JOIN jobs j ON j.id = a.job_id JOIN users u ON u.id = a.applicant_id
       WHERE j.recruiter_id = $1 ORDER BY a.created_at DESC`,
      [req.user.id],
    );
    res.json({ applications: result.rows });
  } catch (error) { next(error); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const allowed = ['submitted', 'reviewing', 'shortlisted', 'rejected', 'hired'];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid application status.' });
    const result = await pool.query(
      `UPDATE applications a SET status = $1, updated_at = NOW()
       FROM jobs j WHERE a.id = $2 AND a.job_id = j.id AND j.recruiter_id = $3
       RETURNING a.id, a.status, a.updated_at`,
      [req.body.status, req.params.id, req.user.id],
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Application not found.' });
    res.json(result.rows[0]);
  } catch (error) { next(error); }
};

exports.downloadResume = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT a.resume_name, a.resume_mime, a.resume_data, a.applicant_id, j.recruiter_id
       FROM applications a JOIN jobs j ON j.id = a.job_id WHERE a.id = $1`,
      [req.params.id],
    );
    const application = result.rows[0];
    if (!application) return res.status(404).json({ message: 'Resume not found.' });
    if (application.applicant_id !== req.user.id && application.recruiter_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have access to this resume.' });
    }
    if (!application.resume_data) return res.status(404).json({ message: 'Resume not found.' });
    res.type(application.resume_mime || 'application/octet-stream');
    res.attachment(application.resume_name || 'resume');
    res.send(application.resume_data);
  } catch (error) { next(error); }
};
