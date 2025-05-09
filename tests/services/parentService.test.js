// Mock des repositories
jest.mock('../../repositories/parentRepository');

// Import des modules
const parentService = require('../../services/parentService');
const parentRepository = require('../../repositories/parentRepository');

describe('ParentService', () => {
  beforeEach(() => {
    // Réinitialiser tous les mocks avant chaque test
    jest.clearAllMocks();
  });

  describe('getAllParents', () => {
    it('should return all parents', async () => {
      // Arrange
      const mockParents = [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '0612345678' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '0612345678' }
      ];
      parentRepository.findAll.mockResolvedValue(mockParents);

      // Act
      const result = await parentService.getAllParents();

      // Assert
      expect(parentRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockParents);
    });
  });

  describe('getParentById', () => {
    it('should return a parent when it exists', async () => {
      // Arrange
      const parentId = 1;
      const mockParent = { id: parentId, name: 'John Doe', email: 'john@example.com', phone: '123456789' };
      parentRepository.findById.mockResolvedValue(mockParent);

      // Act
      const result = await parentService.getParentById(parentId);

      // Assert
      expect(parentRepository.findById).toHaveBeenCalledWith(parentId);
      expect(result).toEqual(mockParent);
    });

    it('should throw an error when parent does not exist', async () => {
      // Arrange
      const parentId = 999;
      parentRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(parentService.getParentById(parentId))
        .rejects
        .toThrow('Parent not found');
      expect(parentRepository.findById).toHaveBeenCalledWith(parentId);
    });
  });

  describe('createParent', () => {
    it('should create a parent with valid data', async () => {
      // Arrange
      const parentData = { 
        name: 'John Doe', 
        email: 'john@example.com', 
        phone: '0612345678' 
      };
      const createdParent = { id: 1, ...parentData };
      
      parentRepository.create.mockResolvedValue(createdParent);
      
      // Act
      const result = await parentService.createParent(parentData);

      // Assert
      expect(parentRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(createdParent);
    });

    it('should throw an error when name is missing', async () => {
      // Arrange
      const invalidData = { 
        email: 'john@example.com', 
        phone: '0612345678' 
      };

      // Act & Assert
      await expect(parentService.createParent(invalidData))
        .rejects
        .toThrow('Parent name is required');
      expect(parentRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error when email is missing', async () => {
      // Arrange
      const invalidData = { 
        name: 'John Doe', 
        phone: '0612345678' 
      };

      // Act & Assert
      await expect(parentService.createParent(invalidData))
        .rejects
        .toThrow('Parent email is required');
      expect(parentRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error when phone is missing', async () => {
      // Arrange
      const invalidData = { 
        name: 'John Doe', 
        email: 'john@example.com'
      };

      // Act & Assert
      await expect(parentService.createParent(invalidData))
        .rejects
        .toThrow('Parent phone is required');
      expect(parentRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error when email format is invalid', async () => {
    // Arrange
    const invalidData = { 
      name: 'John Doe', 
      email: 'invalidemail', // Email sans @
      phone: '0612345678' 
    };

    // Act & Assert
    await expect(parentService.createParent(invalidData))
      .rejects
      .toThrow('Invalid email format, must contain @');
    expect(parentRepository.create).not.toHaveBeenCalled();
  });

    it('should throw an error when phone format is invalid (not starting with 06 or 07)', async () => {
      // Arrange
      const invalidData = { 
        name: 'John Doe', 
        email: 'john@example.com',
        phone: '0512345678' // Commence par 05 au lieu de 06/07
      };

      // Act & Assert
      await expect(parentService.createParent(invalidData))
        .rejects
        .toThrow('Invalid phone format, must start with 06 or 07 and contain 10 digits');
      expect(parentRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error when phone format is invalid (wrong length)', async () => {
      // Arrange
      const invalidData = { 
        name: 'John Doe', 
        email: 'john@example.com',
        phone: '061234567' // Seulement 9 chiffres
      };

      // Act & Assert
      await expect(parentService.createParent(invalidData))
        .rejects
        .toThrow('Invalid phone format, must start with 06 or 07 and contain 10 digits');
      expect(parentRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateParent', () => {
    it('should update a parent with valid data', async () => {
      // Arrange
      const parentId = 1;
      const parentData = { 
        name: 'Updated Name', 
        email: 'updated@example.com', 
        phone: '0612345678' 
      };
      const updatedParent = { id: parentId, ...parentData };
      
      parentRepository.findById.mockResolvedValue({ id: parentId, name: 'Old Name', email: 'old@example.com', phone: '123456789' });
      parentRepository.update.mockResolvedValue(updatedParent);
      
      // Act
      const result = await parentService.updateParent(parentId, parentData);

      // Assert
      expect(parentRepository.findById).toHaveBeenCalledWith(parentId);
      expect(parentRepository.update).toHaveBeenCalledWith(parentId, parentData);
      expect(result).toEqual(updatedParent);
    });

    it('should throw an error when parent does not exist', async () => {
      // Arrange
      const parentId = 999;
      const parentData = { 
        name: 'John Doe', 
        email: 'john@example.com', 
        phone: '0612345678' 
      };
      
      parentRepository.findById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(parentService.updateParent(parentId, parentData))
        .rejects
        .toThrow('Parent not found');
      expect(parentRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error when name is missing', async () => {
      // Arrange
      const parentId = 1;
      const invalidData = { 
        email: 'john@example.com', 
        phone: '0612345678' 
      };
      
      parentRepository.findById.mockResolvedValue({ id: parentId, name: 'Old Name', email: 'old@example.com', phone: '123456789' });
      
      // Act & Assert
      await expect(parentService.updateParent(parentId, invalidData))
        .rejects
        .toThrow('Parent name is required');
      expect(parentRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error when email is missing', async () => {
      // Arrange
      const parentId = 1;
      const invalidData = { 
        name: 'John Doe', 
        phone: '0612345678' 
      };
      
      parentRepository.findById.mockResolvedValue({ id: parentId, name: 'Old Name', email: 'old@example.com', phone: '123456789' });
      
      // Act & Assert
      await expect(parentService.updateParent(parentId, invalidData))
        .rejects
        .toThrow('Parent email is required');
      expect(parentRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error when phone is missing', async () => {
      // Arrange
      const parentId = 1;
      const invalidData = { 
        name: 'John Doe', 
        email: 'john@example.com'
      };
      
      parentRepository.findById.mockResolvedValue({ id: parentId, name: 'Old Name', email: 'old@example.com', phone: '123456789' });
      
      // Act & Assert
      await expect(parentService.updateParent(parentId, invalidData))
        .rejects
        .toThrow('Parent phone is required');
      expect(parentRepository.update).not.toHaveBeenCalled();
    });

     it('should throw an error when email format is invalid', async () => {
    // Arrange
    const parentId = 1;
    const invalidData = { 
      name: 'John Doe', 
      email: 'invalidemail', // Email sans @
      phone: '0612345678' 
    };
    
    parentRepository.findById.mockResolvedValue({ id: parentId, name: 'Old Name', email: 'old@example.com', phone: '0612345678' });
    
    // Act & Assert
    await expect(parentService.updateParent(parentId, invalidData))
      .rejects
      .toThrow('Invalid email format, must contain @');
    expect(parentRepository.update).not.toHaveBeenCalled();
  });

    it('should throw an error when phone format is invalid (not starting with 06 or 07)', async () => {
      // Arrange
      const parentId = 1;
      const invalidData = { 
        name: 'John Doe', 
        email: 'john@example.com',
        phone: '0512345678' // Commence par 05 au lieu de 06/07
      };
      
      parentRepository.findById.mockResolvedValue({ id: parentId, name: 'Old Name', email: 'old@example.com', phone: '0612345678' });
      
      // Act & Assert
      await expect(parentService.updateParent(parentId, invalidData))
        .rejects
        .toThrow('Invalid phone format, must start with 06 or 07 and contain 10 digits');
      expect(parentRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error when phone format is invalid (wrong length)', async () => {
      // Arrange
      const parentId = 1;
      const invalidData = { 
        name: 'John Doe', 
        email: 'john@example.com',
        phone: '061234567' // Seulement 9 chiffres
      };
      
      parentRepository.findById.mockResolvedValue({ id: parentId, name: 'Old Name', email: 'old@example.com', phone: '0612345678' });
      
      // Act & Assert
      await expect(parentService.updateParent(parentId, invalidData))
        .rejects
        .toThrow('Invalid phone format, must start with 06 or 07 and contain 10 digits');
      expect(parentRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteParent', () => {
    it('should delete a parent when it exists', async () => {
      // Arrange
      const parentId = 1;
      parentRepository.findById.mockResolvedValue({ id: parentId, name: 'John Doe' });
      parentRepository.delete.mockResolvedValue(true);

      // Act
      const result = await parentService.deleteParent(parentId);

      // Assert
      expect(parentRepository.findById).toHaveBeenCalledWith(parentId);
      expect(parentRepository.delete).toHaveBeenCalledWith(parentId);
      expect(result).toBe(true);
    });

    it('should throw an error when parent does not exist', async () => {
      // Arrange
      const parentId = 999;
      parentRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(parentService.deleteParent(parentId))
        .rejects
        .toThrow('Parent not found');
      expect(parentRepository.delete).not.toHaveBeenCalled();
    });
  });
});
