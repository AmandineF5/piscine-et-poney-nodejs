const childService = require('../../services/childService');
const childRepository = require('../../repositories/childRepository');

// Mock du repository
jest.mock('../../repositories/childRepository');

describe('ChildService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests pour getAllChildren
  describe('getAllChildren', () => {
    it('should return all children', async () => {
      // Arrange
      const mockChildren = [
        { id: 1, name: 'Child 1' },
        { id: 2, name: 'Child 2' }
      ];
      childRepository.findAll.mockResolvedValue(mockChildren);

      // Act
      const result = await childService.getAllChildren();

      // Assert
      expect(result).toEqual(mockChildren);
      expect(childRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // Tests pour getChildById
  describe('getChildById', () => {
    it('should return a child by id', async () => {
      // Arrange
      const mockChild = { id: 1, name: 'Child 1' };
      childRepository.findById.mockResolvedValue(mockChild);

      // Act
      const result = await childService.getChildById(1);

      // Assert
      expect(result).toEqual(mockChild);
      expect(childRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if child not found', async () => {
      // Arrange
      childRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(childService.getChildById(999))
        .rejects.toThrow('Child with id 999 not found');
      expect(childRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  // Tests pour getChildrenByParentId
  describe('getChildrenByParentId', () => {
    it('should return children by parent id', async () => {
      // Arrange
      const mockChildren = [
        { id: 1, name: 'Child 1', parentId: 1 },
        { id: 2, name: 'Child 2', parentId: 1 }
      ];
      childRepository.findByParentId.mockResolvedValue(mockChildren);

      // Act
      const result = await childService.getChildrenByParentId(1);

      // Assert
      expect(result).toEqual(mockChildren);
      expect(childRepository.findByParentId).toHaveBeenCalledWith(1);
    });
  });

  // Tests pour getChildrenByActivityId
  describe('getChildrenByActivityId', () => {
    it('should return children by activity id', async () => {
      // Arrange
      const mockChildren = [
        { id: 1, name: 'Child 1' },
        { id: 2, name: 'Child 2' }
      ];
      childRepository.findByActivityId.mockResolvedValue(mockChildren);

      // Act
      const result = await childService.getChildrenByActivityId(1);

      // Assert
      expect(result).toEqual(mockChildren);
      expect(childRepository.findByActivityId).toHaveBeenCalledWith(1);
    });
  });

  // Tests pour createChild
  describe('createChild', () => {
    it('should create a child', async () => {
      // Arrange
      const childData = { name: 'Test Child' };
      const createdChild = { id: 1, name: 'Test Child' };
      
      childRepository.create.mockResolvedValue(createdChild);

      // Act
      const result = await childService.createChild(childData);

      // Assert
      expect(result).toEqual(createdChild);
      expect(childRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if name is missing', async () => {
      // Arrange
      const invalidData = {};

      // Act & Assert
      await expect(childService.createChild(invalidData))
        .rejects.toThrow('Child name is required');
      expect(childRepository.create).not.toHaveBeenCalled();
    });

    it('should create a child with a parent if provided', async () => {
      // Arrange
      const childData = { name: 'Test Child', parent: 1 };
      const createdChild = { id: 1, name: 'Test Child', parentId: 1 };
      
      childRepository.create.mockImplementation(async (child) => {
        expect(child.name).toBe(childData.name);
        return createdChild;
      });

      // Act
      const result = await childService.createChild(childData);

      // Assert
      expect(result).toEqual(createdChild);
      expect(childRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should create a child with activities if provided', async () => {
      // Arrange
      const childData = { name: 'Test Child', activities: [1, 2] };
      const createdChild = { id: 1, name: 'Test Child' };
      
      childRepository.create.mockResolvedValue(createdChild);
      // Act
      const result = await childService.createChild(childData);

      // Assert
      expect(result).toEqual(createdChild);
      expect(childRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  // Tests pour updateChild
  describe('updateChild', () => {
    it('should update a child', async () => {
      // Arrange
      const childId = 1;
      const childData = { name: 'Updated Child' };
      const existingChild = { id: 1, name: 'Child 1' };
      const updatedChild = { id: 1, name: 'Updated Child' };
      
      childRepository.findById.mockResolvedValue(existingChild);
      childRepository.update.mockResolvedValue(updatedChild);

      // Act
      const result = await childService.updateChild(childId, childData);

      // Assert
      expect(result).toEqual(updatedChild);
      expect(childRepository.findById).toHaveBeenCalledWith(childId);
      expect(childRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if child not found', async () => {
      // Arrange
      childRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(childService.updateChild(999, { name: 'Test' }))
        .rejects.toThrow('Child with id 999 not found');
      expect(childRepository.update).not.toHaveBeenCalled();
    });
  });

  // Tests pour deleteChild
  describe('deleteChild', () => {
    it('should delete a child', async () => {
      // Arrange
      const childId = 1;
      const existingChild = { id: 1, name: 'Child 1' };
      
      childRepository.findById.mockResolvedValue(existingChild);
      childRepository.delete.mockResolvedValue(true);

      // Act
      await childService.deleteChild(childId);

      // Assert
      expect(childRepository.findById).toHaveBeenCalledWith(childId);
      expect(childRepository.delete).toHaveBeenCalledWith(childId);
    });

    it('should throw an error if child not found', async () => {
      // Arrange
      childRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(childService.deleteChild(999))
        .rejects.toThrow('Child with id 999 not found');
      expect(childRepository.delete).not.toHaveBeenCalled();
    });
  });

  // Tests pour addActivityToChild
  describe('addActivityToChild', () => {
    it('should add an activity to a child', async () => {
      // Arrange
      const childId = 1;
      const activityId = 2;
      const existingChild = { id: 1, name: 'Child 1' };
      const updatedChild = { id: 1, name: 'Child 1', activities: [{ id: 2 }] };
      
      childRepository.findById.mockResolvedValue(existingChild);
      childRepository.addActivity.mockResolvedValue(updatedChild);

      // Act
      const result = await childService.addActivityToChild(childId, activityId);

      // Assert
      expect(result).toEqual(updatedChild);
      expect(childRepository.findById).toHaveBeenCalledWith(childId);
      expect(childRepository.addActivity).toHaveBeenCalledWith(childId, activityId);
    });

    it('should throw an error if child not found', async () => {
      // Arrange
      childRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(childService.addActivityToChild(999, 1))
        .rejects.toThrow('Child with id 999 not found');
      expect(childRepository.addActivity).not.toHaveBeenCalled();
    });
  });

  // Tests pour removeActivityFromChild
  describe('removeActivityFromChild', () => {
    it('should remove an activity from a child', async () => {
      // Arrange
      const childId = 1;
      const activityId = 2;
      const existingChild = { id: 1, name: 'Child 1', activities: [{ id: 2 }] };
      const updatedChild = { id: 1, name: 'Child 1', activities: [] };
      
      childRepository.findById.mockResolvedValue(existingChild);
      childRepository.removeActivity.mockResolvedValue(updatedChild);

      // Act
      const result = await childService.removeActivityFromChild(childId, activityId);

      // Assert
      expect(result).toEqual(updatedChild);
      expect(childRepository.findById).toHaveBeenCalledWith(childId);
      expect(childRepository.removeActivity).toHaveBeenCalledWith(childId, activityId);
    });

    it('should throw an error if child not found', async () => {
      // Arrange
      childRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(childService.removeActivityFromChild(999, 1))
        .rejects.toThrow('Child with id 999 not found');
      expect(childRepository.removeActivity).toHaveBeenCalledTimes(0);
    });
  });

  // Tests pour setParentForChild
  describe('setParentForChild', () => {
    it('should set a parent for a child', async () => {
      // Arrange
      const childId = 1;
      const parentId = 2;
      const existingChild = { id: 1, name: 'Child 1' };
      const updatedChild = { id: 1, name: 'Child 1', parentId: 2 };
      
      childRepository.findById.mockResolvedValue(existingChild);
      childRepository.setParent.mockResolvedValue(updatedChild);

      // Act
      const result = await childService.setParentForChild(childId, parentId);

      // Assert
      expect(result).toEqual(updatedChild);
      expect(childRepository.findById).toHaveBeenCalledWith(childId);
      expect(childRepository.setParent).toHaveBeenCalledWith(childId, parentId);
    });

    it('should throw an error if child not found', async () => {
      // Arrange
      childRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(childService.setParentForChild(999, 1))
        .rejects.toThrow('Child with id 999 not found');
      expect(childRepository.setParent).not.toHaveBeenCalled();
    });
  });

  // Tests pour removeParentFromChild
  describe('removeParentFromChild', () => {
    it('should remove a parent from a child', async () => {
      // Arrange
      const childId = 1;
      const existingChild = { id: 1, name: 'Child 1', parentId: 2 };
      const updatedChild = { id: 1, name: 'Child 1', parentId: null };
      
      childRepository.findById.mockResolvedValue(existingChild);
      childRepository.removeParent.mockResolvedValue(updatedChild);

      // Act
      const result = await childService.removeParentFromChild(childId);

      // Assert
      expect(result).toEqual(updatedChild);
      expect(childRepository.findById).toHaveBeenCalledWith(childId);
      expect(childRepository.removeParent).toHaveBeenCalledWith(childId);
    });

    it('should throw an error if child not found', async () => {
      // Arrange
      childRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(childService.removeParentFromChild(999))
        .rejects.toThrow('Child with id 999 not found');
      expect(childRepository.removeParent).not.toHaveBeenCalled();
    });
  });
});
