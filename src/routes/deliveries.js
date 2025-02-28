const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const authenticate = require('../middlewares/auth');
const rateLimiter = require('../middlewares/rateLimit');

router.post('/', authenticate, rateLimiter, deliveryController.createDeliveries);
router.put('/:id', authenticate, rateLimiter, deliveryController.updateDelivery);

module.exports = router;