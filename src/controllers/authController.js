const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dbPromise = require('../models');
const logger = require('../config/logger');
process.loadEnvFile(); // Carga las variables de entorno desde .env

// Login de usuario
exports.login = async (req, res) => {
  const db = await dbPromise; // Resuelve la promesa para obtener db
  const { username, password } = req.body;
  try {
    const user = await db.User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.error(`Login failed for username: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    logger.info(`User ${username} logged in successfully`);
    res.json({ token });
  } catch (error) {
    logger.error(`Error during login: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Registro de nuevo usuario
exports.register = async (req, res) => {
  const db = await dbPromise; // Resuelve la promesa para obtener db
  const { username, password, company } = req.body;
  try {
    // Verifica si el usuario ya existe
    const existingUser = await db.User.findOne({ where: { username } });
    if (existingUser) {
      logger.error(`Registration failed: Username ${username} already exists`);
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Crea el nuevo usuario (el hook beforeCreate encriptará la contraseña)
    const user = await db.User.create({ username, password, company });
    logger.info(`User ${username} registered successfully`);

    // Genera un token para el nuevo usuario
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  } catch (error) {
    logger.error(`Error during registration: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};