const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const authenticate = require('../middlewares/auth');
const rateLimiter = require('../middlewares/rateLimit');

router.post('/', authenticate, rateLimiter, routeController.createRoute);

module.exports = router;