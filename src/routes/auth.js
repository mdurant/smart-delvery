const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimiter = require('../middlewares/rateLimit');

router.post('/login', rateLimiter, authController.login);
router.post('/register', rateLimiter, authController.register);

module.exports = router;