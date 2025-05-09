const vehicleService = require('../services/vehicleService');

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicleId = parseInt(req.params.id);
    if (isNaN(vehicleId)) {
      throw new Error('Invalid vehicle ID');
    }
    const vehicle = await vehicleService.getVehicleById(vehicleId);
    if (!vehicle) {
      res.status(404).json({ message: 'Vehicle not found' });
    } else {
      res.status(200).json({ success: true, data: vehicle });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVehiclesByParentId = async (req, res) => {
  try {
    const parentId = parseInt(req.params.parentId);
    if (isNaN(parentId)) {
      throw new Error('Invalid parent ID');
    }
    const vehicles = await vehicleService.getVehiclesByParentId(parentId);
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVehiclesByTransportId = async (req, res) => {
  try {
    const transportId = parseInt(req.params.transportId);
    if (isNaN(transportId)) {
      throw new Error('Invalid transport ID');
    }
    const vehicles = await vehicleService.getVehiclesByTransportId(transportId);
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createVehicle = async (req, res) => {
  try {
    const vehicleData = {
      parentId: req.body.parentId,
      availableSeats: req.body.availableSeats
    };
    const newVehicle = await vehicleService.createVehicle(vehicleData);
    res.status(201).json({ success: true, data: newVehicle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const vehicleId = parseInt(req.params.id);
    if (isNaN(vehicleId)) {
      throw new Error('Invalid vehicle ID');
    }
    const vehicleData = {};
    if (req.body.parentId !== undefined) {
      vehicleData.parentId = req.body.parentId;
    }
    if (req.body.availableSeats !== undefined) {
      vehicleData.availableSeats = req.body.availableSeats;
    }
    const updatedVehicle = await vehicleService.updateVehicle(vehicleId, vehicleData);
    if (!updatedVehicle) {
      res.status(404).json({ message: 'Vehicle not found' });
    } else {
      res.status(200).json({ success: true, data: updatedVehicle });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicleId = parseInt(req.params.id);
    if (isNaN(vehicleId)) {
      throw new Error('Invalid vehicle ID');
    }
    await vehicleService.deleteVehicle(vehicleId);
    res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkVehicleAvailability = async (req, res) => {
  try {
    const vehicleId = parseInt(req.params.id);
    const requiredSeats = parseInt(req.query.seats || 1);
    if (isNaN(vehicleId)) {
      throw new Error('Invalid vehicle ID');
    }
    if (isNaN(requiredSeats) || requiredSeats <= 0) {
      throw new Error('Invalid number of seats');
    }
    const isAvailable = await vehicleService.checkVehicleAvailability(vehicleId, requiredSeats);
    res.status(200).json({ 
      success: true, 
      data: { 
        vehicleId, 
        requiredSeats, 
        available: isAvailable 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  getVehiclesByParentId,
  getVehiclesByTransportId,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  checkVehicleAvailability
};
