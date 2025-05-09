const Vehicle = require('../models/vehicleModel');
const vehicleRepository = require('../repositories/vehicleRepository');

class VehicleService {
  /**
   * Récupère tous les véhicules
   * @returns {Promise<Vehicle[]>} Liste des véhicules
   */
  async getAllVehicles() {
    return vehicleRepository.findAll();
  }

  /**
   * Récupère un véhicule par son ID
   * @param {number} id - ID du véhicule
   * @returns {Promise<Vehicle>} Véhicule trouvé
   */
  async getVehicleById(id) {
    return vehicleRepository.findById(id);
  }

  /**
   * Récupère les véhicules d'un parent
   * @param {number} parentId - ID du parent
   * @returns {Promise<Vehicle[]>} Liste des véhicules du parent
   */
  async getVehiclesByParentId(parentId) {
    return vehicleRepository.findByParentId(parentId);
  }

  /**
   * Récupère les véhicules associés à un transport
   * @param {number} transportId - ID du transport
   * @returns {Promise<Vehicle[]>} Liste des véhicules associés
   */
  async getVehiclesByTransportId(transportId) {
    return vehicleRepository.findByTransportId(transportId);
  }

  /**
   * Crée un nouveau véhicule
   * @param {Object} vehicleData - Données du véhicule
   * @returns {Promise<Vehicle>} Véhicule créé
   */
  async createVehicle(vehicleData) {
    console.log(vehicleData)
    // Validation des données
    if (!vehicleData.parent.id || vehicleData.availableSeats === null || vehicleData.availableSeats === undefined) {
      throw new Error('Missing required fields');
    }
    
    if (vehicleData.availableSeats <= 0) {
      throw new Error('Available seats must be greater than 0');
    }
    
    const vehicleId = await vehicleRepository.create(vehicleData);
    return vehicleRepository.findById(vehicleId);
  }

  /**
   * Met à jour un véhicule
   * @param {number} id - ID du véhicule
   * @param {Object} vehicleData - Données à mettre à jour
   * @returns {Promise<Vehicle>} Véhicule mis à jour
   */
  async updateVehicle(id, vehicleData) {
    // Vérifier si le véhicule existe
    await vehicleRepository.findById(id);
    
    // Validation des données
    if (vehicleData.availableSeats !== undefined && vehicleData.availableSeats <= 0) {
      throw new Error('Available seats must be greater than 0');
    }
    
    await vehicleRepository.update(id, vehicleData);
    return vehicleRepository.findById(id);
  }

  /**
   * Supprime un véhicule
   * @param {number} id - ID du véhicule
   * @returns {Promise<boolean>} Succès de la suppression
   */
  async deleteVehicle(id) {
    // Vérifier si le véhicule existe
    await vehicleRepository.findById(id);
    
    // Vérifier si le véhicule est utilisé dans des transports
    const isUsedInTransports = await vehicleRepository.isUsedInTransports(id);
    if (isUsedInTransports) {
      throw new Error('Cannot delete vehicle associated with transports');
    }
    
    return vehicleRepository.delete(id);
  }

  /**
   * Vérifie si un véhicule a suffisamment de places pour un transport
   * @param {number} vehicleId - ID du véhicule
   * @param {number} requiredSeats - Nombre de places nécessaires
   * @returns {Promise<boolean>} Disponibilité du véhicule
   */
  async checkVehicleAvailability(vehicleId, requiredSeats) {
    const vehicle = await vehicleRepository.findById(vehicleId);
    return vehicle.availableSeats >= requiredSeats;
  }
}

module.exports = new VehicleService();
