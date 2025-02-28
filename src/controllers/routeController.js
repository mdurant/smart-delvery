// src/controllers/routeController.js
'use strict';

const dbPromise = require('../models');
const mapService = require('../services/mapService');
const logger = require('../config/logger');

exports.createRoute = async (req, res) => {
  const db = await dbPromise;
  const driverId = req.user.id;

  try {
    const deliveries = await db.Delivery.findAll({ where: { driverId, status: 'pending' } });

    if (deliveries.length < 2) {
      logger.warn(`Route creation failed: Less than 2 deliveries for driver ${req.user.username}`);
      return res.status(400).json({ message: 'At least 2 deliveries required for a route' });
    }

    const addresses = deliveries.map(d => d.address);
    const routeData = await mapService.calculateRoute(addresses);

    const route = await db.Route.create({
      startTime: new Date(),
      averageSpeed: routeData.distance / (routeData.duration / 60), // km/h
      driverId,
    });

    await db.Delivery.update(
      { routeId: route.id },
      { where: { driverId, status: 'pending' } }
    );

    logger.info(`Route ${route.id} created for driver ${req.user.username}`);
    res.json({ route, routeData });
  } catch (error) {
    logger.error(`Error creating route for driver ${req.user.username}: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};