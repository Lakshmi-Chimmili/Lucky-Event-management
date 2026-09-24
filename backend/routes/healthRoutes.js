const express = require('express');
const router = express.Router();

// @route GET /api/health
router.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Event Management API is running'
  });
});

module.exports = router;
