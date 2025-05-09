const transportService = require('../services/transportService');

// Récupérer tous les transports
const getAllTransports = async (req, res) => {
  try {
    const transports = await transportService.getAllTransports();
    res.json(transports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un transport par son ID
const getTransportById = async (req, res) => {
  try {
    const transport = await transportService.getTransportById(parseInt(req.params.id));
    res.json(transport);
  } catch (error) {
    if (error.message === 'Transport not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Récupérer tous les transports pour une activité donnée
const getTransportsByActivity = async (req, res) => {
  try {
    const transports = await transportService.getTransportsByActivity(parseInt(req.params.activityId));
    res.json(transports);
  } catch (error) {
    if (error.message === 'Activity not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Récupérer tous les transports pour un parent donné
const getTransportsByParent = async (req, res) => {
  try {
    const transports = await transportService.getTransportsByParent(parseInt(req.params.parentId));
    res.json(transports);
  } catch (error) {
    if (error.message === 'Parent not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Récupérer tous les transports pour un véhicule donné
const getTransportsByVehicle = async (req, res) => {
  try {
    const transports = await transportService.getTransportsByVehicle(parseInt(req.params.vehicleId));
    res.json(transports);
  } catch (error) {
    if (error.message === 'Vehicle not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Créer un nouveau transport
const createTransport = async (req, res) => {
  try {
    const transport = await transportService.createTransport(req.body);
    res.status(201).json(transport);
  } catch (error) {
    if (error.message.includes('required') || 
        error.message.includes('must be') ||
        error.message.includes('not found')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Mettre à jour un transport
const updateTransport = async (req, res) => {
  try {
    const transport = await transportService.updateTransport(parseInt(req.params.id), req.body);
    res.json(transport);
  } catch (error) {
    if (error.message === 'Transport not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes('required') || 
               error.message.includes('must be') ||
               error.message.includes('not found')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Supprimer un transport
const deleteTransport = async (req, res) => {
  try {
    await transportService.deleteTransport(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Transport not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  getAllTransports,
  getTransportById,
  getTransportsByActivity,
  getTransportsByVehicle,
  getTransportsByParent,
  createTransport,
  updateTransport,
  deleteTransport
};
