// Importer les mocks du repository
jest.mock('../../repositories/vehicleRepository');

// Importer le service et le repository
const vehicleService = require('../../services/vehicleService');
const vehicleRepository = require('../../repositories/vehicleRepository');

describe('VehicleService', () => {
  beforeEach(() => {
    // Réinitialiser tous les mocks avant chaque test
    jest.clearAllMocks();
  });

  describe('getAllVehicles', () => {
    it('should return all vehicles', async () => {
      // Arrange
      const mockVehicles = [
        { id: 1, parentId: 1, availableSeats: 4 },
        { id: 2, parentId: 2, availableSeats: 2 }
      ];
      vehicleRepository.findAll.mockResolvedValue(mockVehicles);

      // Act
      const result = await vehicleService.getAllVehicles();

      // Assert
      expect(vehicleRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockVehicles);
    });
  });

  describe('getVehicleById', () => {
    it('should return a vehicle when it exists', async () => {
      // Arrange
      const mockVehicle = { id: 1, parentId: 1, availableSeats: 4 };
      vehicleRepository.findById.mockResolvedValue(mockVehicle);

      // Act
      const result = await vehicleService.getVehicleById(1);

      // Assert
      expect(vehicleRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('getVehiclesByParentId', () => {
    it('should return vehicles for a parent', async () => {
      // Arrange
      const parentId = 1;
      const mockVehicles = [
        { id: 1, parentId: 1, availableSeats: 4 },
        { id: 3, parentId: 1, availableSeats: 2 }
      ];
      vehicleRepository.findByParentId.mockResolvedValue(mockVehicles);

      // Act
      const result = await vehicleService.getVehiclesByParentId(parentId);

      // Assert
      expect(vehicleRepository.findByParentId).toHaveBeenCalledWith(parentId);
      expect(result).toEqual(mockVehicles);
    });
  });

  describe('createVehicle', () => {
    it('should create a vehicle with valid data', async () => {
      // Arrange
      const vehicleData = {
        parentId: 1,
        availableSeats: 4
      };
      const newVehicleId = 1;
      const newVehicle = { id: newVehicleId, ...vehicleData };
      
      vehicleRepository.create.mockResolvedValue(newVehicleId);
      vehicleRepository.findById.mockResolvedValue(newVehicle);

      // Act
      const result = await vehicleService.createVehicle(vehicleData);

      // Assert
      expect(vehicleRepository.create).toHaveBeenCalledWith(vehicleData);
      expect(vehicleRepository.findById).toHaveBeenCalledWith(newVehicleId);
      expect(result).toEqual(newVehicle);
    });

    it('should throw an error if parentId is missing', async () => {
      // Arrange
      const vehicleData = {
        availableSeats: 4
      };

      // Act & Assert
      await expect(vehicleService.createVehicle(vehicleData))
        .rejects
        .toThrow('Missing required fields');
      
      expect(vehicleRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if availableSeats is missing', async () => {
      // Arrange
      const vehicleData = {
        parentId: 1
      };

      // Act & Assert
      await expect(vehicleService.createVehicle(vehicleData))
        .rejects
        .toThrow('Missing required fields');
      
      expect(vehicleRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if availableSeats is less than or equal to 0', async () => {
      // Arrange
      const vehicleData = {
        parentId: 1,
        availableSeats: 0
      };

      // Act & Assert
      await expect(vehicleService.createVehicle(vehicleData))
        .rejects
        .toThrow('Available seats must be greater than 0');
      
      expect(vehicleRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateVehicle', () => {
    it('should update a vehicle with valid data', async () => {
      // Arrange
      const vehicleId = 1;
      const vehicleData = {
        availableSeats: 5
      };
      const updatedVehicle = { 
        id: vehicleId, 
        parentId: 1,
        availableSeats: 5 
      };
      
      vehicleRepository.findById.mockResolvedValue({ id: vehicleId });
      vehicleRepository.update.mockResolvedValue(true);
      vehicleRepository.findById.mockResolvedValueOnce({ id: vehicleId })
        .mockResolvedValueOnce(updatedVehicle);

      // Act
      const result = await vehicleService.updateVehicle(vehicleId, vehicleData);

      // Assert
      expect(vehicleRepository.findById).toHaveBeenCalledWith(vehicleId);
      expect(vehicleRepository.update).toHaveBeenCalledWith(vehicleId, vehicleData);
      expect(vehicleRepository.findById).toHaveBeenCalledWith(vehicleId);
      expect(result).toEqual(updatedVehicle);
    });

    it('should throw an error if availableSeats is less than or equal to 0', async () => {
      // Arrange
      const vehicleId = 1;
      const vehicleData = {
        availableSeats: 0
      };
      
      vehicleRepository.findById.mockResolvedValue({ id: vehicleId });

      // Act & Assert
      await expect(vehicleService.updateVehicle(vehicleId, vehicleData))
        .rejects
        .toThrow('Available seats must be greater than 0');
      
      expect(vehicleRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteVehicle', () => {
    it('should delete a vehicle that is not used in transports', async () => {
      // Arrange
      const vehicleId = 1;
      
      vehicleRepository.findById.mockResolvedValue({ id: vehicleId });
      vehicleRepository.isUsedInTransports.mockResolvedValue(false);
      vehicleRepository.delete.mockResolvedValue(true);

      // Act
      const result = await vehicleService.deleteVehicle(vehicleId);

      // Assert
      expect(vehicleRepository.findById).toHaveBeenCalledWith(vehicleId);
      expect(vehicleRepository.isUsedInTransports).toHaveBeenCalledWith(vehicleId);
      expect(vehicleRepository.delete).toHaveBeenCalledWith(vehicleId);
      expect(result).toBe(true);
    });

    it('should throw an error if vehicle is used in transports', async () => {
      // Arrange
      const vehicleId = 1;
      
      vehicleRepository.findById.mockResolvedValue({ id: vehicleId });
      vehicleRepository.isUsedInTransports.mockResolvedValue(true);

      // Act & Assert
      await expect(vehicleService.deleteVehicle(vehicleId))
        .rejects
        .toThrow('Cannot delete vehicle associated with transports');
      
      expect(vehicleRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('checkVehicleAvailability', () => {
    it('should return true if vehicle has enough seats', async () => {
      // Arrange
      const vehicleId = 1;
      const requiredSeats = 2;
      const mockVehicle = { id: vehicleId, availableSeats: 4 };
      
      vehicleRepository.findById.mockResolvedValue(mockVehicle);

      // Act
      const result = await vehicleService.checkVehicleAvailability(vehicleId, requiredSeats);

      // Assert
      expect(vehicleRepository.findById).toHaveBeenCalledWith(vehicleId);
      expect(result).toBe(true);
    });

    it('should return false if vehicle does not have enough seats', async () => {
      // Arrange
      const vehicleId = 1;
      const requiredSeats = 5;
      const mockVehicle = { id: vehicleId, availableSeats: 4 };
      
      vehicleRepository.findById.mockResolvedValue(mockVehicle);

      // Act
      const result = await vehicleService.checkVehicleAvailability(vehicleId, requiredSeats);

      // Assert
      expect(vehicleRepository.findById).toHaveBeenCalledWith(vehicleId);
      expect(result).toBe(false);
    });
  });
});
