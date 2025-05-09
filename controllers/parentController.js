const parentService = require('../services/parentService');

// Récupérer tous les parents
const getAllParents = async (req, res) => {
  try {
    const parents = await parentService.getAllParents();
    res.json(parents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un parent par son ID
const getParentById = async (req, res) => {
  try {
    const parent = await parentService.getParentById(parseInt(req.params.id));
    res.json(parent);
  } catch (error) {
    if (error.message === 'Parent not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Récupérer un parent par son ID avec ses enfants
const getParentByIdWithChildren = async (req, res) => {
  try {
    const parent = await parentService.getParentByIdWithChildren(parseInt(req.params.id));
    res.json(parent);
  } catch (error) {
    if (error.message === 'Parent not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Créer un nouveau parent
const createParent = async (req, res) => {
  try {
    const transport = await parentService.createParent(req.body);
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

// Mettre à jour un parent
const updateParent = async (req, res) => {
  try {
    const parent = await parentService.updateParent(parseInt(req.params.id), req.body);
    res.json(parent);
  } catch (error) {
    if (error.message === 'Parent not found') {
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

// Supprimer un parent
const deleteParent = async (req, res) => {
  try {
    await parentService.deleteParent(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Parent not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  getAllParents,
  getParentById,
  getParentByIdWithChildren,
  createParent,
  updateParent,
  deleteParent
};
