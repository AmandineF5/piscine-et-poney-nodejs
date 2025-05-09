// Mock des repositories
jest.mock('../../repositories/activityRepository');

// Import des modules
const activityService = require('../../services/activityService');
const activityRepository = require('../../repositories/activityRepository');

describe('ActivityService', () => {
  beforeEach(() => {
    // Réinitialiser tous les mocks avant chaque test
    jest.clearAllMocks();
  });

  describe('getAllActivities', () => {
    it('should return all activities', async () => {
      // Arrange
      const mockActivities = [
        { id: 1, name: 'Swimming', address: 'Pool Address' },
        { id: 2, name: 'Football', address: 'Stadium Address' }
      ];
      activityRepository.findAll.mockResolvedValue(mockActivities);

      // Act
      const result = await activityService.getAllActivities();

      // Assert
      expect(activityRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockActivities);
    });
  });

  describe('getActivityById', () => {
    it('should return an activity when it exists', async () => {
      // Arrange
      const activityId = 1;
      const mockActivity = { id: activityId, name: 'Swimming', address: 'Pool Address' };
      activityRepository.findById.mockResolvedValue(mockActivity);

      // Act
      const result = await activityService.getActivityById(activityId);

      // Assert
      expect(activityRepository.findById).toHaveBeenCalledWith(activityId);
      expect(result).toEqual(mockActivity);
    });

    it('should throw an error when activity does not exist', async () => {
      // Arrange
      const activityId = 999;
      activityRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(activityService.getActivityById(activityId))
        .rejects
        .toThrow('Activity not found');
      expect(activityRepository.findById).toHaveBeenCalledWith(activityId);
    });
  });

  describe('createActivity', () => {
    it('should create an activity with valid data', async () => {
      // Arrange
      const activityData = { 
        name: 'Swimming', 
        address: 'Pool Address'
      };
      const createdActivity = { id: 1, ...activityData };
      
      activityRepository.create.mockResolvedValue(createdActivity);
      
      // Act
      const result = await activityService.createActivity(activityData);

      // Assert
      expect(activityRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: activityData.name,
          address: activityData.address
        })
      );
      expect(result).toEqual(createdActivity);
    });

    it('should throw an error when name is missing', async () => {
      // Arrange
      const invalidData = { 
        address: 'Pool Address'
      };

      // Act & Assert
      await expect(activityService.createActivity(invalidData))
        .rejects
        .toThrow('Activity name is required');
      expect(activityRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error when name is empty', async () => {
      // Arrange
      const invalidData = { 
        name: '   ',
        address: 'Pool Address'
      };

      // Act & Assert
      await expect(activityService.createActivity(invalidData))
        .rejects
        .toThrow('Activity name is required');
      expect(activityRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error when address is missing', async () => {
      // Arrange
      const invalidData = { 
        name: 'Swimming'
      };

      // Act & Assert
      await expect(activityService.createActivity(invalidData))
        .rejects
        .toThrow('Activity address is required');
      expect(activityRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error when address is empty', async () => {
      // Arrange
      const invalidData = { 
        name: 'Swimming',
        address: '   '
      };

      // Act & Assert
      await expect(activityService.createActivity(invalidData))
        .rejects
        .toThrow('Activity address is required');
      expect(activityRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateActivity', () => {
    it('should update an activity when it exists', async () => {
      // Arrange
      const activityId = 1;
      const activityData = { 
        name: 'Updated Swimming', 
        address: 'Updated Pool Address'
      };
      
      const updatedActivity = { id: activityId, ...activityData };
      
      activityRepository.findById.mockResolvedValue({ id: activityId, name: 'Swimming', address: 'Pool Address' });
      activityRepository.update.mockResolvedValue(updatedActivity);
      
      // Act
      const result = await activityService.updateActivity(activityId, activityData);
      
      // Assert
      expect(activityRepository.findById).toHaveBeenCalledWith(activityId);
      expect(activityRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: activityId,
          name: activityData.name,
          address: activityData.address
        })
      );
      expect(result).toEqual(updatedActivity);
    });

    it('should throw an error when activity does not exist', async () => {
      // Arrange
      const activityId = 999;
      const activityData = { 
        name: 'Updated Swimming', 
        address: 'Updated Pool Address'
      };
      
      activityRepository.findById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(activityService.updateActivity(activityId, activityData))
        .rejects
        .toThrow('Activity not found');
      expect(activityRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error when name is missing', async () => {
      // Arrange
      const activityId = 1;
      const invalidData = { 
        address: 'Pool Address'
      };
      
      activityRepository.findById.mockResolvedValue({ id: activityId, name: 'Swimming', address: 'Pool Address' });
      
      // Act & Assert
      await expect(activityService.updateActivity(activityId, invalidData))
        .rejects
        .toThrow('Activity name is required');
      expect(activityRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error when address is missing', async () => {
      // Arrange
      const activityId = 1;
      const invalidData = { 
        name: 'Swimming'
      };
      
      activityRepository.findById.mockResolvedValue({ id: activityId, name: 'Swimming', address: 'Pool Address' });
      
      // Act & Assert
      await expect(activityService.updateActivity(activityId, invalidData))
        .rejects
        .toThrow('Activity address is required');
      expect(activityRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteActivity', () => {
    it('should delete an activity when it exists', async () => {
      // Arrange
      const activityId = 1;
      activityRepository.findById.mockResolvedValue({ id: activityId, name: 'Swimming' });
      activityRepository.delete.mockResolvedValue(true);

      // Act
      const result = await activityService.deleteActivity(activityId);

      // Assert
      expect(activityRepository.findById).toHaveBeenCalledWith(activityId);
      expect(activityRepository.delete).toHaveBeenCalledWith(activityId);
      expect(result).toBe(true);
    });

    it('should throw an error when activity does not exist', async () => {
      // Arrange
      const activityId = 999;
      activityRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(activityService.deleteActivity(activityId))
        .rejects
        .toThrow('Activity not found');
      expect(activityRepository.delete).not.toHaveBeenCalled();
    });
  });
});
