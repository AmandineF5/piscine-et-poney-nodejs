const express = require('express');
const transportController = require('../controllers/transportController');

const router = express.Router();

// Routes de base pour les transports
router.get('/', transportController.getAllTransports);
router.get('/:id', transportController.getTransportById);
router.post('/', transportController.createTransport);
router.put('/:id', transportController.updateTransport);
router.delete('/:id', transportController.deleteTransport);

// Routes supplémentaires pour les relations
router.get('/activity/:activityId', transportController.getTransportsByActivity);
router.get('/parent/:parentId', transportController.getTransportsByParent);
router.get('/vehicle/:vehicleId', transportController.getTransportsByVehicle);

module.exports = router;
