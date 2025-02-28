// src/config/db.js
const { Sequelize } = require('sequelize');
const logger = require('../config/logger'); // Importa el logger configurado

process.loadEnvFile();

// Configuración de la conexión a MySQL
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  logging: (msg) => logger.info(msg), // Redirecciona los logs de Sequelize a Winston
});

// Función para autenticar y sincronizar la base de datos
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Conexión a BD establecida correctamente.');
  } catch (error) {
    logger.error(`No se pudo conectar a la base de datos: ${error.message}`);
    process.exit(1); // Salir del proceso en caso de error
  }
};

module.exports = { sequelize, connectDB };
