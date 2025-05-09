const transportRepository = require('../repositories/transportRepository');
const activityRepository = require('../repositories/activityRepository');
const vehicleRepository = require('../repositories/vehicleRepository');
const parentRepository = require('../repositories/parentRepository.js');
const Transport = require('../models/transportModel');

class TransportService {
  async getAllTransports() {
    return await transportRepository.findAll();
  }
  
  async getTransportById(id) {
    const transport = await transportRepository.findById(id);
    if (!transport) {
      throw new Error('Transport not found');
    }
    return transport;
  }
  
  async getTransportsByActivity(activityId) {
    const activity = await activityRepository.findById(activityId);
    if (!activity) {
      throw new Error('Activity not found');
    }
    
    return await transportRepository.findByActivityId(activityId);
  }

  async getTransportsByParent(parentId) {
    const parent = await parentRepository.findById(parentId);
    if (!parent) {
      throw new Error('Parent not found');
    }
    
    return await transportRepository.findByParentId(parentId);
  }
  
  async getTransportsByVehicle(vehicleId) {
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    
    return await transportRepository.findByVehicleId(vehicleId);
  }
  
  async createTransport(transportData) {
    // Validation des données
    await this._validateTransportData(transportData);
    
    // Vérification de l'existence de l'activité et du véhicule
    const activity = await activityRepository.findById(transportData.activity.id);
    if (!activity) {
      throw new Error('Activity not found');
    }
      
    return await transportRepository.create(transportData);
  }
  
  async updateTransport(id, transportData) {
    // Vérification que le transport existe
    const existingTransport = await transportRepository.findById(id);
    
    if (!existingTransport) {
      throw new Error('Transport not found');
    }
 
    // Validation des données
    await this._validateTransportData(transportData);
   
    // Vérification de l'existence de l'activité et du véhicule
    if (transportData?.activityId) {
      const activity = await activityRepository.findById(transportData.activityId);
      if (!activity) {
        throw new Error('Activity not found');
      }
    }
    
    if (transportData?.vehicle.id) {
      const vehicle = await vehicleRepository.findById(transportData.vehicle.id);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
    }
    
    // Mise à jour du transport
    const updatedTransport = new Transport(
      id,
      transportData.type || existingTransport.type,
      transportData.dateStart || existingTransport.dateStart,
      transportData.dateEnd || existingTransport.dateEnd,
      transportData.pickupLocation || existingTransport.pickupLocation,
      transportData.activityId || existingTransport.activityId
    );
    
    return await transportRepository.update(id, updatedTransport);
  }
  
  async deleteTransport(id) {
    // Vérification que le transport existe
    const existingTransport = await transportRepository.findById(id);
    if (!existingTransport) {
      throw new Error('Transport not found');
    }
    
    // Suppression du transport
    await transportRepository.delete(id);
    return true;
  }
  
  // Méthode privée pour valider les données d'un transport
  async _validateTransportData(transport) {
    if (!transport?.type || !['OUTWARD', 'RETURN'].includes(transport.type)) {
      throw new Error('Transport type must be either "OUTWARD" or "RETURN"');
    }
    
    if (!transport?.dateStart || isNaN(transport.dateStart)) {
      throw new Error('Valid start date is required');
    }
    
    if (!transport?.dateEnd || isNaN(transport.dateEnd)) {
      throw new Error('Valid end date is required');
    }
    
    if (transport.dateEnd <= transport.dateStart) {
      throw new Error('End date must be after start date');
    }
    
    if (!transport?.pickupLocation || transport.pickupLocation.trim() === '') {
      throw new Error('Pickup location is required');
    }
    
    if (!transport?.activity?.id) {
      throw new Error('Activity is required');
    }

    if (!transport?.vehicle.availableSeats || isNaN(transport.vehicle.availableSeats)) {
      throw new Error('Vehicle\'s available seats info is required');
    }
  }
}

module.exports = new TransportService();
