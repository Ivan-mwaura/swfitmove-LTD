const express = require('express');
const router = express.Router();
const { adminLogin, createAdmin } = require('../Controllers/adminLogin');

// POST: Admin login
router.post('/adminLogin', adminLogin);

// POST: Create admin
router.post('/createAdmin', createAdmin);


module.exports = router;
