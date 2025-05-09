const db = require('../config/database');
const Child = require('../models/childModel');
const Parent = require('../models/parentModel');
const Activity = require('../models/activityModel');

class ChildRepository {
  /**
   * Find all children with their parent and activities
   * @returns {Promise<Array>} Array of children
   */
  async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT 
          c.*,
          p.id as p_id, p.name as parent_name, p.email as parent_email, p.phone as parent_phone,
          a.id as a_id, a.name as activity_name, a.address as activity_address
        FROM Child c
        LEFT JOIN ParentChild pc ON c.id = pc.child_id
        LEFT JOIN Parent p ON pc.parent_id = p.id
        LEFT JOIN ChildActivity ca ON c.id = ca.child_id
        LEFT JOIN Activity a ON ca.activity_id = a.id
      `);
      
      if (!rows || rows.length === 0) {
        return [];
      }
      
      // Group by child to handle multiple activities
      const childMap = new Map();
      
      for (const row of rows) {
        // If this child is not yet in our map, create it
        if (!childMap.has(row.id)) {
          const child = Child.fromDatabase(row);
          childMap.set(row.id, {
            child,
            activities: new Map()
          });
          
          // Set parent if exists
          if (row.p_id) {
            const parent = Parent.fromDatabase(row);
            childMap.get(row.id).child.setParent(parent);
          }
        }
        
        // Add activity if exists and not already added
        if (row.a_id && !childMap.get(row.id).activities.has(row.a_id)) {
          const activity = Activity.fromDatabase(row);
          childMap.get(row.id).activities.set(row.a_id, activity);
          childMap.get(row.id).child.addActivity(activity);
        }
      }
      
      // Return just the children objects
      return Array.from(childMap.values()).map(item => item.child);
      
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch children');
    }
  }
  
  /**
   * Find a child by id with their parent and activities
   * @param {number} id - The child id
   * @returns {Promise<Child>} The child
   */
  async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT 
          c.*,
          p.id as p_id, p.name as parent_name, p.email as parent_email, p.phone as parent_phone,
          a.id as a_id, a.name as activity_name, a.address as activity_address
        FROM Child c
        LEFT JOIN ParentChild pc ON c.id = pc.child_id
        LEFT JOIN Parent p ON pc.parent_id = p.id
        LEFT JOIN ChildActivity ca ON c.id = ca.child_id
        LEFT JOIN Activity a ON ca.activity_id = a.id
        WHERE c.id = ?
      `, [id]);
      
      if (!rows || rows.length === 0) {
        return null;
      }
      
      // Create child object
      const child = Child.fromDatabase(rows[0]);
      
      // Add parent if exists
      if (rows[0].p_id) {
        const parent = Parent.fromDatabase(rows[0]);
        child.setParent(parent);
      }
      
      // Add activities if they exist
      const activitiesMap = new Map();
      for (const row of rows) {
        if (row.a_id && !activitiesMap.has(row.a_id)) {
          const activity = Activity.fromDatabase(row);
          activitiesMap.set(row.a_id, activity);
          child.addActivity(activity);
        }
      }
      
      return child;
      
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch child with id ${id}`);
    }
  }
  
  /**
   * Find children by parent id
   * @param {number} parentId - The parent id
   * @returns {Promise<Array>} Array of children
   */
  async findByParentId(parentId) {
    try {
      const [rows] = await db.query(`
        SELECT 
          c.*,
          p.id as p_id, p.name as parent_name, p.email as parent_email, p.phone as parent_phone,
          a.id as a_id, a.name as activity_name, a.address as activity_address
        FROM Child c
        JOIN ParentChild pc ON c.id = pc.child_id
        JOIN Parent p ON pc.parent_id = p.id
        LEFT JOIN ChildActivity ca ON c.id = ca.child_id
        LEFT JOIN Activity a ON ca.activity_id = a.id
        WHERE p.id = ?
      `, [parentId]);
      
      if (!rows || rows.length === 0) {
        return [];
      }
      
      // Group by child to handle multiple activities
      const childMap = new Map();
      
      for (const row of rows) {
        // If this child is not yet in our map, create it
        if (!childMap.has(row.id)) {
          const child = Child.fromDatabase(row);
          childMap.set(row.id, {
            child,
            activities: new Map()
          });
          
          // Set parent
          const parent = Parent.fromDatabase(row);
          childMap.get(row.id).child.setParent(parent);
        }
        
        // Add activity if exists and not already added
        if (row.a_id && !childMap.get(row.id).activities.has(row.a_id)) {
          const activity = Activity.fromDatabase(row);
          childMap.get(row.id).activities.set(row.a_id, activity);
          childMap.get(row.id).child.addActivity(activity);
        }
      }
      
      // Return just the children objects
      return Array.from(childMap.values()).map(item => item.child);
      
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch children for parent with id ${parentId}`);
    }
  }
  
  /**
   * Find children by activity id
   * @param {number} activityId - The activity id
   * @returns {Promise<Array>} Array of children
   */
  async findByActivityId(activityId) {
    try {
      const [rows] = await db.query(`
        SELECT 
          c.*,
          p.id as p_id, p.name as parent_name, p.email as parent_email, p.phone as parent_phone,
          a.id as a_id, a.name as activity_name, a.address as activity_address
        FROM Child c
        JOIN ChildActivity ca ON c.id = ca.child_id
        JOIN Activity a ON ca.activity_id = a.id
        LEFT JOIN ParentChild pc ON c.id = pc.child_id
        LEFT JOIN Parent p ON pc.parent_id = p.id
        WHERE a.id = ?
      `, [activityId]);
      
      if (!rows || rows.length === 0) {
        return [];
      }
      
      // Group by child
      const childMap = new Map();
      
      for (const row of rows) {
        // If this child is not yet in our map, create it
        if (!childMap.has(row.id)) {
          const child = Child.fromDatabase(row);
          childMap.set(row.id, {
            child,
            activities: new Map()
          });
          
          // Set parent if exists
          if (row.p_id) {
            const parent = Parent.fromDatabase(row);
            childMap.get(row.id).child.setParent(parent);
          }
        }
        
        // Add activity
        if (row.a_id && !childMap.get(row.id).activities.has(row.a_id)) {
          const activity = Activity.fromDatabase(row);
          childMap.get(row.id).activities.set(row.a_id, activity);
          childMap.get(row.id).child.addActivity(activity);
        }
      }
      
      // Return just the children objects
      return Array.from(childMap.values()).map(item => item.child);
      
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch children for activity with id ${activityId}`);
    }
  }
  
  /**
   * Create a new child
   * @param {Child} child - The child to create
   * @returns {Promise<Child>} The created child
   */
  async create(child) {
    try {
      const connection = await db.getConnection();
      await connection.beginTransaction();
      
      try {
        // Insert child
        const [result] = await connection.query(`
          INSERT INTO Child (name) VALUES (?)
        `, [child.name]);
        
        const childId = result.insertId;
        
        // Add parent association if provided (one parent only)
        if (child.parent) {
          await connection.query(`
            INSERT INTO ParentChild (parent_id, child_id) VALUES (?, ?)
          `, [child.parent.id, childId]);
        }
        
        // Add activities associations if provided
        if (child.activities && child.activities.length > 0) {
          for (const activity of child.activities) {
            await connection.query(`
              INSERT INTO ChildActivity (child_id, activity_id) VALUES (?, ?)
            `, [childId, activity.id]);
          }
        }
        
        await connection.commit();
        
        // Return the newly created child
        return await this.findById(childId);
        
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
      
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to create child');
    }
  }
  
  /**
   * Update a child
   * @param {Child} child - The child to update
   * @returns {Promise<Child>} The updated child
   */
  async update(child) {
    try {
      const connection = await db.getConnection();
      await connection.beginTransaction();
      
      try {
        // Update child basic info
        await connection.query(`
          UPDATE Child SET name = ? WHERE id = ?
        `, [child.name, child.id]);
        
        // Update parent association - Remove existing parent and add new one if provided
        await connection.query(`
          DELETE FROM ParentChild WHERE child_id = ?
        `, [child.id]);
        
        if (child.parent) {
          await connection.query(`
            INSERT INTO ParentChild (parent_id, child_id) VALUES (?, ?)
          `, [child.parent.id, child.id]);
        }
        
        // Update activities - Remove all existing and add new ones
        await connection.query(`
          DELETE FROM ChildActivity WHERE child_id = ?
        `, [child.id]);
        
        if (child.activities && child.activities.length > 0) {
          for (const activity of child.activities) {
            await connection.query(`
              INSERT INTO ChildActivity (child_id, activity_id) VALUES (?, ?)
            `, [child.id, activity.id]);
          }
        }
        
        await connection.commit();
        
        // Return the updated child
        return await this.findById(child.id);
        
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
      
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to update child with id ${child.id}`);
    }
  }
  
  /**
   * Delete a child
   * @param {number} id - The child id
   * @returns {Promise<boolean>} true if successful
   */
  async delete(id) {
    try {
      const connection = await db.getConnection();
      await connection.beginTransaction();
      
      try {
        // Delete all associations first
        await connection.query('DELETE FROM ParentChild WHERE child_id = ?', [id]);
        await connection.query('DELETE FROM ChildActivity WHERE child_id = ?', [id]);
        
        // Delete the child
        await connection.query('DELETE FROM Child WHERE id = ?', [id]);
        
        await connection.commit();
        return true;
        
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
      
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to delete child with id ${id}`);
    }
  }
  
  /**
   * Add a specific activity to a child
   * @param {number} childId - The child id
   * @param {number} activityId - The activity id
   * @returns {Promise<Child>} The updated child
   */
  async addActivity(childId, activityId) {
    try {
      // Check if association already exists
      const [existingRows] = await db.query(`
        SELECT * FROM ChildActivity 
        WHERE child_id = ? AND activity_id = ?
      `, [childId, activityId]);
      
      if (existingRows.length === 0) {
        // Add new association
        await db.query(`
          INSERT INTO ChildActivity (child_id, activity_id) 
          VALUES (?, ?)
        `, [childId, activityId]);
      }
      
      // Return updated child
      return await this.findById(childId);
      
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to add activity to child`);
    }
  }
  
  /**
   * Remove a specific activity from a child
   * @param {number} childId - The child id
   * @param {number} activityId - The activity id
   * @returns {Promise<Child>} The updated child
   */
  async removeActivity(childId, activityId) {
    try {
      await db.query(`
        DELETE FROM ChildActivity 
        WHERE child_id = ? AND activity_id = ?
      `, [childId, activityId]);
      
      // Return updated child
      return await this.findById(childId);
      
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to remove activity from child`);
    }
  }
  
  /**
   * Set parent for a child
   * @param {number} childId - The child id
   * @param {number} parentId - The parent id
   * @returns {Promise<Child>} The updated child
   */
  async setParent(childId, parentId) {
    try {
      const connection = await db.getConnection();
      await connection.beginTransaction();
      
      try {
        // Remove existing parent association
        await connection.query(`
          DELETE FROM ParentChild WHERE child_id = ?
        `, [childId]);
        
        // Add new parent association
        await connection.query(`
          INSERT INTO ParentChild (parent_id, child_id) 
          VALUES (?, ?)
        `, [parentId, childId]);
        
        await connection.commit();
        
        // Return updated child
        return await this.findById(childId);
        
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
      
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to set parent for child`);
    }
  }
  
  /**
   * Remove parent from a child
   * @param {number} childId - The child id
   * @returns {Promise<Child>} The updated child
   */
  async removeParent(childId) {
    try {
      await db.query(`
        DELETE FROM ParentChild WHERE child_id = ?
      `, [childId]);
      
      // Return updated child
      return await this.findById(childId);
      
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to remove parent from child`);
    }
  }
  
  /**
   * Remove a child from a parent
   * @param {number} childId - The child id
   * @param {number} parentId - The parent id
   * @returns {Promise<Child>} The updated child
   */
  async removeChildFromParent(childId, parentId) {
    try {
      await db.query(`
        DELETE FROM ParentChild 
        WHERE child_id = ? AND parent_id = ?
      `, [childId, parentId]);
      
      // Return updated child
      return await this.findById(childId);
      
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to remove child from parent`);
    }
  }
}

module.exports = new ChildRepository();
