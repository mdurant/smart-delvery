'use strict';

const express = require('express');
const dbPromise = require('./models'); // Importa la promesa de los modelos
const authRoutes = require('./routes/auth');
const deliveryRoutes = require('./routes/deliveries');
const routeRoutes = require('./routes/routes');
const logger = require('./config/logger');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configura las rutas
app.use('/auth', authRoutes);
app.use('/deliveries', deliveryRoutes);
app.use('/routes', routeRoutes);

const PORT = process.env.PORT || 3000;

// Inicia la aplicación de forma asíncrona
(async () => {
  try {
    // Resuelve la promesa para cargar los modelos y la conexión a la base de datos
    const db = await dbPromise;

    // Opcional: Sincroniza la base de datos (solo para desarrollo, elimina en producción)
    // await db.sequelize.sync({ force: false });
    // logger.info('Database synchronized');

    // Inicia el servidor
    app.listen(PORT, () => {
      logger.info(`Servidor escuchando en el puerto ${PORT}`);
      logger.info(`Entorno de ejecución: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Nombre de la base de datos conectada: ${process.env.DB_NAME}`);
      logger.info(`Dialecto SQL: mysql`); // Hardcoded porque usamos MySQL
      logger.info(`Nombre de la APP: ${process.env.NAME_APP || 'Smart Delivery'}`);
      logger.info(`URL de la APP: ${process.env.URL_APP || 'http://localhost:3000'}/api`);
    });
  } catch (error) {
    logger.error('Error inicializando la aplicación:', error);
    process.exit(1); // Detiene el proceso si falla la inicialización
  }
})();

module.exports = app;