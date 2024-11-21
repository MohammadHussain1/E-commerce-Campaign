const express = require('express');
const { upload, uploadCSV } = require('../controllers/uploadController');

const router = express.Router();

// Endpoint to upload CSV file
router.post('/', upload.single('file'), uploadCSV);

module.exports = router;
