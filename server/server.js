require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = require('./src/app');
const pool = require('./src/config/database');

const port = process.env.PORT || 5000;

async function start() {
  try {
    await pool.query('SELECT 1');

    // Keeping the schema in SQL makes the database structure easy to study.
    // The script is idempotent, so it is safe to run again after a restart.
    const schema = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
    await pool.query(schema);

    if (process.env.SEED_DEMO_DATA === 'true') {
      const seed = fs.readFileSync(path.join(__dirname, '..', 'database', 'seed.sql'), 'utf8');
      await pool.query(seed);
    }
    app.listen(port, () => console.log(`API running at http://localhost:${port}`));
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error.message);
    process.exit(1);
  }
}

start();
