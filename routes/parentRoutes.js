const express = require('express');
const parentController = require('../controllers/parentController');

const router = express.Router();

// Définition des routes pour les parents
router.get('/', parentController.getAllParents);
router.get('/:id', parentController.getParentById);
router.get('/children/:id', parentController.getParentByIdWithChildren);
router.post('/', parentController.createParent);
router.put('/:id', parentController.updateParent);
router.delete('/:id', parentController.deleteParent);

module.exports = router;
