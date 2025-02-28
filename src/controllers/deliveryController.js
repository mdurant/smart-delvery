const Delivery = require('../models/Delivery');
const logger = require('../config/logger');
const dbPromise = require('../models');

exports.createDeliveries = async (req, res) => {
  const db = await dbPromise; // Resuelve la promesa para obtener db
  const { addresses } = req.body;
  const driverId = req.user.id;

  try {
    const deliveries = await db.Delivery.bulkCreate(
      addresses.map(address => ({ address, driverId }))
    );

    logger.info(`Driver ${req.user.username} added ${addresses.length} deliveries`);
    res.status(201).json(deliveries);
  } catch (error) {
    logger.error(`Error creating deliveries: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateDelivery = async (req, res) => {
   const db = await dbPromise; // Resuelve la promesa para obtener db
  const { id } = req.params;
  const { receiverName } = req.body;

  try {
    const delivery = await db.Delivery.findByPk(id);
    if (!delivery || delivery.driverId !== req.user.id) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    delivery.status = 'delivered';
    delivery.deliveredAt = new Date();
    delivery.receiverName = receiverName;
    await delivery.save();

    logger.info(`Delivery ${id} marked as delivered by ${req.user.username}`);
    res.json(delivery);
  } catch (error) {
    logger.error(`Error updating delivery: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};