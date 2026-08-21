module.exports = function errorHandler(error, _req, res, _next) {
  console.error(error);
  if (error.code === '23505') return res.status(409).json({ message: 'That record already exists.' });
  if (error.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'Resume must be smaller than 3 MB.' });
  res.status(error.status || 500).json({ message: error.message || 'Unexpected server error.' });
};
