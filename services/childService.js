const childRepository = require('../repositories/childRepository');
const Child = require('../models/childModel');

class ChildService {
  /**
   * Get all children
   * @returns {Promise<Array>} Array of children
   */
  async getAllChildren() {
    return await childRepository.findAll();
  }
  
  /**
   * Get a child by id
   * @param {number} id - The child id
   * @returns {Promise<Child>} The child
   * @throws {Error} If child not found
   */
  async getChildById(id) {
    const child = await childRepository.findById(id);
    if (!child) {
      throw new Error(`Child with id ${id} not found`);
    }
    return child;
  }
  
  /**
   * Get children by parent id
   * @param {number} parentId - The parent id
   * @returns {Promise<Array>} Array of children
   */
  async getChildrenByParentId(parentId) {
    return await childRepository.findByParentId(parentId);
  }
  
  /**
   * Get children by activity id
   * @param {number} activityId - The activity id
   * @returns {Promise<Array>} Array of children
   */
  async getChildrenByActivityId(activityId) {
    return await childRepository.findByActivityId(activityId);
  }
  
  /**
   * Create a new child
   * @param {Object} data - The child data
   * @returns {Promise<Child>} The created child
   * @throws {Error} If validation fails
   */
  async createChild(data) {
    this._validateChildData(data);
    
    const child = new Child();
    child.name = data.name;
    
    // Set parent if provided
    if (data.parent) {
      child.setParent(data.parent);
    }
    
    // Add activities if provided
    if (data.activities && Array.isArray(data.activities)) {
      data.activities.forEach(activity => {
        child.addActivity(activity);
      });
    }
    
    return await childRepository.create(child);
  }
  
  /**
   * Update a child
   * @param {number} id - The child id
   * @param {Object} data - The child data
   * @returns {Promise<Child>} The updated child
   * @throws {Error} If validation fails or child not found
   */
  async updateChild(id, data) {
    const existingChild = await this.getChildById(id);
    this._validateChildData(data);
    
    existingChild.name = data.name;
    
    // Update parent if provided
    if (data.parent) {
      existingChild.setParent(data.parent);
    } else {
      existingChild.parent = null;
    }
    
    // Update activities if provided
    if (data.activities && Array.isArray(data.activities)) {
      // Clear existing activities
      existingChild.activities = [];
      
      // Add new activities
      data.activities.forEach(activity => {
        existingChild.addActivity(activity);
      });
    }
    
    return await childRepository.update(existingChild);
  }
  
  /**
   * Delete a child
   * @param {number} id - The child id
   * @returns {Promise<boolean>} true if successful
   * @throws {Error} If child not found
   */
  async deleteChild(id) {
    await this.getChildById(id); // Ensure child exists
    return await childRepository.delete(id);
  }
  
  /**
   * Add an activity to a child
   * @param {number} childId - The child id
   * @param {number} activityId - The activity id
   * @returns {Promise<Child>} The updated child
   * @throws {Error} If child not found
   */
  async addActivityToChild(childId, activityId) {
    await this.getChildById(childId); // Ensure child exists
    return await childRepository.addActivity(childId, activityId);
  }
  
  /**
   * Remove an activity from a child
   * @param {number} childId - The child id
   * @param {number} activityId - The activity id
   * @returns {Promise<Child>} The updated child
   * @throws {Error} If child not found
   */
  async removeActivityFromChild(childId, activityId) {
    await this.getChildById(childId); // Ensure child exists
    return await childRepository.removeActivity(childId, activityId);
  }
  
  /**
   * Set parent for a child
   * @param {number} childId - The child id
   * @param {number} parentId - The parent id
   * @returns {Promise<Child>} The updated child
   * @throws {Error} If child not found
   */
  async setParentForChild(childId, parentId) {
    await this.getChildById(childId); // Ensure child exists
    return await childRepository.setParent(childId, parentId);
  }
  
  /**
   * Remove parent from a child
   * @param {number} childId - The child id
   * @returns {Promise<Child>} The updated child
   * @throws {Error} If child not found
   */
  async removeParentFromChild(childId) {
    await this.getChildById(childId); // Ensure child exists
    return await childRepository.removeParent(childId);
  }
  
  /**
   * Add child to parent
   * @param {number} childId - The child id
   * @param {number} parentId - The parent id
   * @returns {Promise<Child>} The updated child
   * @throws {Error} If child not found
   */
  async addChildToParent(childId, parentId) {
    await this.getChildById(childId); // Ensure child exists
    return await childRepository.setParent(childId, parentId);
  }
  
  /**
   * Remove child from parent
   * @param {number} childId - The child id
   * @param {number} parentId - The parent id
   * @returns {Promise<Child>} The updated child
   * @throws {Error} If child not found
   */
  async removeChildFromParent(childId, parentId) {
    await this.getChildById(childId); // Ensure child exists
    return await childRepository.removeChildFromParent(childId, parentId);
  }
  
  /**
   * Validate child data
   * @param {Object} data - The child data to validate
   * @throws {Error} If validation fails
   * @private
   */
  _validateChildData(data) {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Child name is required');
    }
  }
}

module.exports = new ChildService();
