'use strict';

const fs = require('fs').promises; // Usamos la versión promisificada para async/await
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, '..', '..', 'config', 'config.js'); // Ruta más segura
const config = require(configPath)[env];
const logger = require('../config/logger'); // Añadimos logger para depuración
const db = {};

let sequelize;
try {
  if (!config) {
    throw new Error(`Environment "${env}" not found in ${configPath}`);
  }

  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, {
      ...config,
      logging: msg => logger.debug(msg), // Redirige logs de Sequelize a Winston
    });
  }

  // Prueba la conexión al iniciar
  sequelize.authenticate()
    .then(() => logger.info('Database connection established successfully'))
    .catch(err => logger.error('Unable to connect to the database:', err));
} catch (error) {
  logger.error(`Error initializing Sequelize: ${error.message}`);
  throw error; // Detiene la ejecución si falla la configuración
}

// Carga modelos de forma asíncrona
async function loadModels() {
  try {
    const files = await fs.readdir(__dirname);
    const modelFiles = files.filter(file => {
      return (
        file.indexOf('.') !== 0 && // Excluye archivos ocultos
        file !== basename &&       // Excluye index.js
        file.endsWith('.js') &&    // Solo archivos .js
        !file.includes('.test.')   // Excluye archivos de prueba
      );
    });

    for (const file of modelFiles) {
      try {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
        logger.debug(`Model loaded: ${model.name}`);
      } catch (error) {
        logger.error(`Error loading model ${file}: ${error.message}`);
      }
    }

    // Ejecuta asociaciones
    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
        logger.debug(`Associations executed for ${modelName}`);
      }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
  } catch (error) {
    logger.error(`Error loading models: ${error.message}`);
    throw error;
  }
}

// Exporta una promesa para cargar los modelos
module.exports = loadModels();