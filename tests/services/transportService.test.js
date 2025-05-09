// Importer les mocks des repositories
jest.mock('../../repositories/transportRepository');
jest.mock('../../repositories/activityRepository');
jest.mock('../../repositories/vehicleRepository');
jest.mock('../../repositories/parentRepository');

// Importer le service et les repositories
const transportService = require('../../services/transportService');
const transportRepository = require('../../repositories/transportRepository');
const activityRepository = require('../../repositories/activityRepository');
const vehicleRepository = require('../../repositories/vehicleRepository');
const parentRepository = require('../../repositories/parentRepository');

describe('TransportService', () => {
  beforeEach(() => {
    // Réinitialiser tous les mocks avant chaque test
    jest.clearAllMocks();
  });

  describe('getAllTransports', () => {
    it('should return all transports', async () => {
      // Arrange
      const mockTransports = [
        { id: 1, type: 'outward' },
        { id: 2, type: 'return' }
      ];
      transportRepository.findAll.mockResolvedValue(mockTransports);

      // Act
      const result = await transportService.getAllTransports();

      // Assert
      expect(transportRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTransports);
    });
  });

  describe('getTransportById', () => {
    it('should return a transport when it exists', async () => {
      // Arrange
      const mockTransport = { id: 1, type: 'outward' };
      transportRepository.findById.mockResolvedValue(mockTransport);

      // Act
      const result = await transportService.getTransportById(1);

      // Assert
      expect(transportRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTransport);
    });

    it('should throw an error when transport does not exist', async () => {
      // Arrange
      transportRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(transportService.getTransportById(999))
        .rejects
        .toThrow('Transport not found');
      
      expect(transportRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('getTransportsByActivity', () => {
    it('should return transports when activity exists', async () => {
      // Arrange
      const activityId = 1;
      const mockActivity = { id: activityId, name: 'Swimming' };
      const mockTransports = [
        { id: 1, type: 'outward', activityId: activityId },
        { id: 2, type: 'return', activityId: activityId }
      ];

      activityRepository.findById.mockResolvedValue(mockActivity);
      transportRepository.findByActivityId.mockResolvedValue(mockTransports);

      // Act
      const result = await transportService.getTransportsByActivity(activityId);

      // Assert
      expect(activityRepository.findById).toHaveBeenCalledWith(activityId);
      expect(transportRepository.findByActivityId).toHaveBeenCalledWith(activityId);
      expect(result).toEqual(mockTransports);
    });

    it('should throw an error when activity does not exist', async () => {
      // Arrange
      const activityId = 999;
      activityRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(transportService.getTransportsByActivity(activityId))
        .rejects
        .toThrow('Activity not found');
      
      expect(activityRepository.findById).toHaveBeenCalledWith(activityId);
      expect(transportRepository.findByActivityId).not.toHaveBeenCalled();
    });
  });

  describe('getTransportsByParent', () => {
    it('should return transports when parent exists', async () => {
      // Arrange
      const parentId = 1;
      const mockParent = { id: parentId, name: 'John Doe' };
      const mockTransports = [
        { id: 1, type: 'outward' },
        { id: 2, type: 'return' }
      ];

      parentRepository.findById.mockResolvedValue(mockParent);
      transportRepository.findByParentId.mockResolvedValue(mockTransports);

      // Act
      const result = await transportService.getTransportsByParent(parentId);

      // Assert
      expect(parentRepository.findById).toHaveBeenCalledWith(parentId);
      expect(transportRepository.findByParentId).toHaveBeenCalledWith(parentId);
      expect(result).toEqual(mockTransports);
    });

    it('should throw an error when parent does not exist', async () => {
      // Arrange
      const parentId = 999;
      parentRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(transportService.getTransportsByParent(parentId))
        .rejects
        .toThrow('Parent not found');
      
      expect(parentRepository.findById).toHaveBeenCalledWith(parentId);
      expect(transportRepository.findByParentId).not.toHaveBeenCalled();
    });
  });

  describe('createTransport', () => {
    it('should create a transport with valid data', async () => {
      // Arrange
      const transportData = {
        type: 'outward',
        dateStart: 1707123456,
        dateEnd: 1707127056,
        pickupLocation: 'School',
        activityId: 1,
        vehicle: {
          availableSeats: 3
        }
      };
      
      const activityId = 1;
      const mockActivity = { id: activityId, name: 'Swimming' };
      
      const createdTransport = { id: 1, ...transportData };

      activityRepository.findById.mockResolvedValue(mockActivity);
      transportRepository.create.mockResolvedValue(createdTransport);
      
      // Act
      const result = await transportService.createTransport(transportData);

      // Assert
      expect(activityRepository.findById).toHaveBeenCalledWith(activityId);
      expect(transportRepository.create).toHaveBeenCalledWith(transportData);
      expect(result).toEqual(createdTransport);
    });

    it('should throw an error when activity does not exist', async () => {
      // Arrange
      const transportData = {
        type: 'outward',
        dateStart: 1707123456,
        dateEnd: 1707127056,
        pickupLocation: 'School',
        activityId: 999,
        vehicle: {
          availableSeats: 3
        }
      };

      activityRepository.findById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(transportService.createTransport(transportData))
        .rejects
        .toThrow('Activity not found');
      
      expect(activityRepository.findById).toHaveBeenCalledWith(999);
      expect(transportRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error for invalid transport type', async () => {
      // Arrange
      const transportData = {
        type: 'invalid',
        dateStart: 1707123456,
        dateEnd: 1707127056,
        pickupLocation: 'School',
        activityId: 1,
        vehicle: {
          availableSeats: 3
        }
      };
      
      // Act & Assert
      await expect(transportService.createTransport(transportData))
        .rejects
        .toThrow('Transport type must be either "outward" or "return"');
      
      expect(transportRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error for missing dateStart', async () => {
      // Arrange
      const transportData = {
        type: 'outward',
        dateEnd: 1707127056,
        pickupLocation: 'School',
        activityId: 1,
        vehicle: {
          availableSeats: 3
        }
      };
      
      // Act & Assert
      await expect(transportService.createTransport(transportData))
        .rejects
        .toThrow('Valid start date is required');
      
      expect(transportRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error when dateEnd is before dateStart', async () => {
      // Arrange
      const transportData = {
        type: 'outward',
        dateStart: 1707127056,
        dateEnd: 1707123456, // Earlier than dateStart
        pickupLocation: 'School',
        activityId: 1,
        vehicle: {
          availableSeats: 3
        }
      };
      
      // Act & Assert
      await expect(transportService.createTransport(transportData))
        .rejects
        .toThrow('End date must be after start date');
      
      expect(transportRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error for missing pickup location', async () => {
      // Arrange
      const transportData = {
        type: 'outward',
        dateStart: 1707123456,
        dateEnd: 1707127056,
        pickupLocation: '',
        activityId: 1,
        vehicle: {
          availableSeats: 3
        }
      };
      
      // Act & Assert
      await expect(transportService.createTransport(transportData))
        .rejects
        .toThrow('Pickup location is required');
      
      expect(transportRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error for missing available seats', async () => {
      // Arrange
      const transportData = {
        type: 'outward',
        dateStart: 1707123456,
        dateEnd: 1707127056,
        pickupLocation: 'School',
        activityId: 1,
        vehicle: {}
      };
      
      // Act & Assert
      await expect(transportService.createTransport(transportData))
        .rejects
        .toThrow('Vehicle\'s available seats info is required');
      
      expect(transportRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateTransport', () => {
    it('should update a transport with valid data', async () => {
      // Arrange
      const transportId = 1;
      const existingTransport = {
        id: transportId,
        type: 'outward',
        dateStart: 1707123456,
        dateEnd: 1707127056,
        pickupLocation: 'School',
        activityId: 1,
        vehicle: {
          id: 1,
          availableSeats: 3
        }
      };

      const transportData = {
        type: 'return',
        dateStart: 1707223456,
        dateEnd: 1707227056,
        pickupLocation: 'Park',
        activityId: 2,
        vehicle: {
          id: 2,
          availableSeats: 4
        }
      };

      const mockActivity = { id: 2, name: 'Swimming' };
      const mockVehicle = { id: 2, model: 'Tesla Model S' };

      transportRepository.findById.mockResolvedValue(existingTransport);
      activityRepository.findById.mockResolvedValue(mockActivity);
      vehicleRepository.findById.mockResolvedValue(mockVehicle);
      transportRepository.update.mockResolvedValue({ ...existingTransport, ...transportData });

      // Act
      const result = await transportService.updateTransport(transportId, transportData);

      // Assert
      expect(transportRepository.findById).toHaveBeenCalledWith(transportId);
      expect(activityRepository.findById).toHaveBeenCalledWith(2);
      expect(vehicleRepository.findById).toHaveBeenCalledWith(2);
      expect(transportRepository.update).toHaveBeenCalled();
      expect(result).toEqual({ ...existingTransport, ...transportData });
    });

    it('should throw an error when transport does not exist', async () => {
      // Arrange
      const transportId = 999;
      const transportData = {
        type: 'return',
        vehicle: { availableSeats: 3 }
      };

      transportRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(transportService.updateTransport(transportId, transportData))
        .rejects
        .toThrow('Transport not found');

      expect(transportRepository.findById).toHaveBeenCalledWith(transportId);
      expect(transportRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error when activity does not exist', async () => {
      // Arrange
      const transportId = 1;
      const existingTransport = {
        id: transportId,
        type: 'outward',
        dateStart: 1707123456,
        dateEnd: 1707127056,
        pickupLocation: 'School',
        activityId: 1
      };

      const transportData = {...existingTransport,
        activityId: 999,
        vehicle: { availableSeats: 3 }
      };

      transportRepository.findById.mockResolvedValue(existingTransport);
      activityRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(transportService.updateTransport(transportId, transportData))
        .rejects
        .toThrow('Activity not found');

      expect(transportRepository.findById).toHaveBeenCalledWith(transportId);
      expect(activityRepository.findById).toHaveBeenCalledWith(999);
      expect(transportRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error when vehicle does not exist', async () => {
      // Arrange
      const transportId = 1;
      const existingTransport = {
        id: transportId,
        type: 'outward',
        dateStart: 1707123456,
        dateEnd: 1707127056,
        pickupLocation: 'School',
        activityId: 2
      };

      const transportData = {...existingTransport,
        vehicle: { id: 999, availableSeats: 3 }
      };
      
      const mockActivity = { id: 2, name: 'Swimming' };

      activityRepository.findById.mockResolvedValue(mockActivity);
      transportRepository.findById.mockResolvedValue(existingTransport);
      vehicleRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(transportService.updateTransport(transportId, transportData))
        .rejects
        .toThrow('Vehicle not found');

      expect(transportRepository.update).not.toHaveBeenCalled();
      expect(transportRepository.findById).toHaveBeenCalledWith(transportId);
      expect(vehicleRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('deleteTransport', () => {
    it('should delete a transport when it exists', async () => {
      // Arrange
      const transportId = 1;
      const existingTransport = { id: transportId, type: 'outward' };

      transportRepository.findById.mockResolvedValue(existingTransport);
      transportRepository.delete.mockResolvedValue(true);

      // Act
      const result = await transportService.deleteTransport(transportId);

      // Assert
      expect(transportRepository.findById).toHaveBeenCalledWith(transportId);
      expect(transportRepository.delete).toHaveBeenCalledWith(transportId);
      expect(result).toBe(true);
    });

    it('should throw an error when transport does not exist', async () => {
      // Arrange
      const transportId = 999;
      transportRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(transportService.deleteTransport(transportId))
        .rejects
        .toThrow('Transport not found');

      expect(transportRepository.findById).toHaveBeenCalledWith(transportId);
      expect(transportRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('_validateTransportData', () => {
    it('should validate a complete valid transport data', async () => {
      // Arrange
      const validTransportData = {
        type: 'outward',
        dateStart: 1707123456,
        dateEnd: 1707127056,
        pickupLocation: 'School',
        activityId: 1,
        vehicle: {
          availableSeats: 3
        }
      };

      // Act & Assert
      await expect(transportService._validateTransportData(validTransportData))
        .resolves
        .not.toThrow();
    });
  });
});
