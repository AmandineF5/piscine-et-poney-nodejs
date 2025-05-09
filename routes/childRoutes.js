const express = require('express');
const childController = require('../controllers/childController');

const router = express.Router();

// Routes de base pour les enfants
router.get('/', childController.getAllChildren);
router.get('/:id', childController.getChildById);
router.post('/', childController.createChild);
router.put('/:id', childController.updateChild);
router.delete('/:id', childController.deleteChild);

// Routes supplémentaires pour les relations
router.get('/parent/:parentId', childController.getChildrenByParentId);
router.get('/activity/:activityId', childController.getChildrenByActivityId);

// Routes pour gérer les relations entre enfants et activités
router.post('/:childId/activities/:activityId', childController.addActivityToChild);
router.delete('/:childId/activities/:activityId', childController.removeActivityFromChild);

// Routes pour gérer les relations entre enfants et parents
router.post('/:childId/parent/:parentId', childController.setParentForChild);
router.delete('/:childId/parent', childController.removeParentFromChild);

module.exports = router;
