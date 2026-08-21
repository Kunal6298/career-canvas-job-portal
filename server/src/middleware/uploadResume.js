const multer = require('multer');

module.exports = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024, files: 1, fields: 4 },
  fileFilter: (_req, file, callback) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const accepted = allowed.includes(file.mimetype);
    callback(accepted ? null : new Error('Resume must be a PDF, DOC, or DOCX file.'), accepted);
  },
});
