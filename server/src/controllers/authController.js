const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'seeker' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters.' });
    if (!['seeker', 'recruiter'].includes(role)) return res.status(400).json({ message: 'Invalid account role.' });
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, LOWER($2), $3, $4) RETURNING id, name, email, role',
      [name.trim(), email.trim(), passwordHash, role],
    );
    const user = result.rows[0];
    res.status(201).json({ user, token: generateToken(user) });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = LOWER($1)', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ message: 'Incorrect email or password.' });
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.json({ user: safeUser, token: generateToken(safeUser) });
  } catch (error) { next(error); }
};
