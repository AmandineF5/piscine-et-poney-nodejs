const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Routes pour les véhicules
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.post('/', vehicleController.createVehicle);
router.put('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

// Routes pour la disponibilité des véhicules
router.get('/:id/availability', vehicleController.checkVehicleAvailability);

// Routes pour les relations
router.get('/parent/:parentId', vehicleController.getVehiclesByParentId);
router.get('/transport/:transportId', vehicleController.getVehiclesByTransportId);

module.exports = router;
