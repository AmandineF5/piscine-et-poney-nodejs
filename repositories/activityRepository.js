const db = require('../config/database');
const Activity = require('../models/activityModel');

class ActivityRepository {
   /**
   * Find all activities
   * @returns {Promise<Array>} Array of activities
   */
  async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM Activity');
      return rows.map(row => Activity.fromDatabase(row));
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch activities');
    }
  }
  
  /**
 * Find a vehicle by its ID
 * @param {number} id - Vehicle ID
 * @returns {Promise<Object|null>} Vehicle data or null if not found
 */
  async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM Activity WHERE id = ?', [id]);
      if (!rows || rows.length === 0) {
        return null;
      }
      const row = rows[0];
      return Activity.fromDatabase(row);
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch activity');
    }
  }
  
  /**
   * Create a new activity
   * @param {Object} activity - Activity data
   * @returns {Promise<Object>} Created activity
   */
  async create(activity) {
    try {
      const [result] = await db.query(
        'INSERT INTO Activity (name, address) VALUES (?, ?)',
        [activity.name, activity.address]
      );
      return new Activity(result.insertId, activity.name, activity.address);
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to create activity');
    }
  }
  
  /**
   * Update a activity
   * @param {Object} activity - Activity data with ID
   * @returns {Promise<Object>} Updated activity
   */
  async update(activity) {
    try {
      await db.query(
        'UPDATE Activity SET name = ?, address = ? WHERE id = ?',
        [activity.name, activity.address, activity.id]
      );
      return activity;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to update activity');
    }
  }
  
  /**
   * Delete a activity by ID
   * @param {number} id - Activity ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async delete(id) {
    try {
      await db.query('DELETE FROM Activity WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to delete activity');
    }
  }
}

module.exports = new ActivityRepository();
