const express = require('express');
const cors = require('cors');
const activityRoutes = require('./routes/activityRoutes');
const transportRoutes = require('./routes/transportRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

// Initialisation de l'application Express
const app = express();

// Configuration des middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging des requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/activities', activityRoutes);
app.use('/api/transports', transportRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Piscine et Poney API' });
});

// Middleware de gestion d'erreur 404
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Middleware de gestion des erreurs générales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Configuration du port
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
