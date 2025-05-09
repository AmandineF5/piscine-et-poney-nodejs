const express = require('express');
const activityController = require('../controllers/activityController');

const router = express.Router();

// Définition des routes pour les activités
router.get('/', activityController.getAllActivities);
router.get('/:id', activityController.getActivityById);
router.post('/', activityController.createActivity);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);

module.exports = router;
