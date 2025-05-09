const childService = require('../services/childService');

class ChildController {
  /**
   * Get all children
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllChildren(req, res) {
    try {
      const children = await childService.getAllChildren();
      res.status(200).json(children);
    } catch (error) {
      console.error('Error in getAllChildren:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  /**
   * Get a child by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getChildById(req, res) {
    try {
      const childId = parseInt(req.params.id);
      const child = await childService.getChildById(childId);
      
      res.status(200).json(child);
    } catch (error) {
      console.error('Error in getChildById:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  /**
   * Get children by parent ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getChildrenByParentId(req, res) {
    try {
      const parentId = parseInt(req.params.parentId);
      const children = await childService.getChildrenByParentId(parentId);
      
      res.status(200).json(children);
    } catch (error) {
      console.error('Error in getChildrenByParentId:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  /**
   * Get children by activity ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getChildrenByActivityId(req, res) {
    try {
      const activityId = parseInt(req.params.activityId);
      const children = await childService.getChildrenByActivityId(activityId);
      
      res.status(200).json(children);
    } catch (error) {
      console.error('Error in getChildrenByActivityId:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  /**
   * Create a new child
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createChild(req, res) {
    try {
      const childData = req.body;
      const newChild = await childService.createChild(childData);
      
      res.status(201).json(newChild);
    } catch (error) {
      console.error('Error in createChild:', error);
      
      if (error.message.includes('required')) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  /**
   * Update a child
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateChild(req, res) {
    try {
      const childId = parseInt(req.params.id);
      const childData = req.body;
      
      const updatedChild = await childService.updateChild(childId, childData);
      
      res.status(200).json(updatedChild);
    } catch (error) {
      console.error('Error in updateChild:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      
      if (error.message.includes('required')) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  /**
   * Delete a child
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteChild(req, res) {
    try {
      const childId = parseInt(req.params.id);
      
      await childService.deleteChild(childId);
      
      res.status(204).end();
    } catch (error) {
      console.error('Error in deleteChild:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  /**
   * Add an activity to a child
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async addActivityToChild(req, res) {
    try {
      const childId = parseInt(req.params.childId);
      const activityId = parseInt(req.params.activityId);
      
      const updatedChild = await childService.addActivityToChild(childId, activityId);
      
      res.status(200).json(updatedChild);
    } catch (error) {
      console.error('Error in addActivityToChild:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  /**
   * Remove an activity from a child
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async removeActivityFromChild(req, res) {
    try {
      const childId = parseInt(req.params.childId);
      const activityId = parseInt(req.params.activityId);
      
      const updatedChild = await childService.removeActivityFromChild(childId, activityId);
      
      res.status(200).json(updatedChild);
    } catch (error) {
      console.error('Error in removeActivityFromChild:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  /**
   * Set parent for a child
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async setParentForChild(req, res) {
    try {
      const childId = parseInt(req.params.childId);
      const parentId = parseInt(req.params.parentId);
      
      const updatedChild = await childService.setParentForChild(childId, parentId);
      
      res.status(200).json(updatedChild);
    } catch (error) {
      console.error('Error in setParentForChild:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  /**
   * Remove parent from a child
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async removeParentFromChild(req, res) {
    try {
      const childId = parseInt(req.params.childId);
      
      const updatedChild = await childService.removeParentFromChild(childId);
      
      res.status(200).json(updatedChild);
    } catch (error) {
      console.error('Error in removeParentFromChild:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = new ChildController();
