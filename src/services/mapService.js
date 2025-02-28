// src/services/mapService.js
'use strict';

const axios = require('axios');
const logger = require('../config/logger');
process.loadEnvFile();

class MapService {
  async calculateRoute(addresses) {
    try {
      if (!process.env.GOOGLE_MAPS_API_KEY) {
        throw new Error('Google Maps API key is missing');
      }

      const origin = addresses[0];
      const destination = addresses[addresses.length - 1];
      const waypoints = addresses.slice(1, -1).join('|');

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypoints}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      logger.debug(`Google Maps API request URL: ${url}`);

      const response = await axios.get(url);

      // Verifica si la respuesta contiene rutas
      if (!response.data.routes || response.data.routes.length === 0) {
        throw new Error('No routes found in Google Maps response');
      }

      const route = response.data.routes[0];
      return {
        distance: route.legs.reduce((acc, leg) => acc + leg.distance.value, 0) / 1000, // km
        duration: route.legs.reduce((acc, leg) => acc + leg.duration.value, 0) / 60, // minutos
        path: route.overview_polyline.points,
      };
    } catch (error) {
      logger.error(`Error calculating route: ${error.message}`);
      throw error; // Propaga el error al controlador
    }
  }
}

module.exports = new MapService();