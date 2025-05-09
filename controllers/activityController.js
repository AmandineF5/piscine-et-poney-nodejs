const activityService = require('../services/activityService');

// Récupérer toutes les activités
const getAllActivities = async (req, res) => {
  try {
    const activities = await activityService.getAllActivities();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une activité par son ID
const getActivityById = async (req, res) => {
  try {
    const activity = await activityService.getActivityById(parseInt(req.params.id));
    res.json(activity);
  } catch (error) {
    if (error.message === 'Activity not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Créer une nouvelle activité
const createActivity = async (req, res) => {
  try {
    const activity = await activityService.createActivity(req.body);
    res.status(201).json(activity);
  } catch (error) {
    if (error.message.includes('required')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Mettre à jour une activité
const updateActivity = async (req, res) => {
  try {
    const activity = await activityService.updateActivity(parseInt(req.params.id), req.body);
    res.json(activity);
  } catch (error) {
    if (error.message === 'Activity not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes('required')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Supprimer une activité
const deleteActivity = async (req, res) => {
  try {
    await activityService.deleteActivity(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Activity not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
};
