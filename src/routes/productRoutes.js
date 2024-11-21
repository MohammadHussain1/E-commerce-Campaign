const express = require('express');
const { getReportByCampaign, getReportByAdGroupID, getReportByFsnID, getReportByProductName } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Reporting API Endpoints
router.post('/report/campaign', authMiddleware,getReportByCampaign);
router.post('/report/adGroupID', authMiddleware,getReportByAdGroupID);
router.post('/report/fsnID',authMiddleware, getReportByFsnID);
router.post('/report/productName',authMiddleware, getReportByProductName);

module.exports = router;
