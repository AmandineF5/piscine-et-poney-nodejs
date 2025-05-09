const activityRepository = require('../repositories/activityRepository');
const Activity = require('../models/activityModel');

class ActivityService {
  async getAllActivities() {
    return await activityRepository.findAll();
  }
  
  async getActivityById(id) {
    const activity = await activityRepository.findById(id);
    if (!activity) {
      throw new Error('Activity not found');
    }
    return activity;
  }
  
  async createActivity(activityData) {
    this._validateActivityData(activityData);
    const activity = new Activity(null, activityData.name, activityData.address);

    return await activityRepository.create(activity);
  }
  
  async updateActivity(id, activityData) {
    const existingActivity = await activityRepository.findById(id);
    if (!existingActivity) {
      throw new Error('Activity not found');
    }
    
    this._validateActivityData(activityData);

    const updatedActivity = new Activity(
      id, 
      activityData.name, 
      activityData.address
    );
    
    return await activityRepository.update(updatedActivity);
  }
  
  async deleteActivity(id) {
    const existingActivity = await activityRepository.findById(id);
    if (!existingActivity) {
      throw new Error('Activity not found');
    }
    
    await activityRepository.delete(id);
    return true;
  }
  
  _validateActivityData(data) {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Activity name is required');
    }
    
    if (!data.address || data.address.trim() === '') {
      throw new Error('Activity address is required');
    }
  }
}

module.exports = new ActivityService();
