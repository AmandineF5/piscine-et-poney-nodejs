const db = require('../config/database');
const Vehicle = require('../models/vehicleModel');
const Parent = require('../models/parentModel');

class VehicleRepository {
  /**
   * Find all vehicles
   * @returns {Promise<Array>} Array of vehicles
   */
  async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT 
        v.*,
        p.id as p_id, p.name as parent_name, p.email as parent_email, p.phone as parent_phone 
        FROM Vehicle v
        JOIN Parent p ON v.parent_id = p.id;
      `);
      if(rows || rows[0]?.length > 0) {
        return rows.map(row => {
        
        const parent = Parent.fromDatabase(row);
        
        const vehicle = Vehicle.fromDatabase(row);
        vehicle.setParent(parent);
        
        return vehicle
      });
      }
      return [];
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch vehicles');
    }
  }

  /**
   * Find a vehicle by its ID
   * @param {number} id - Vehicle ID
   * @returns {Promise<Object|null>} Vehicle data or null if not found
   */
  async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT 
        v.*,
        p.id as p_id, p.name as parent_name, p.email as parent_email, p.phone as parent_phone 
        FROM Vehicle v
        JOIN Parent p ON v.parent_id = p.id;
      `, [id]);
      if (!rows || rows.length === 0) {
        return null;
      }
      const row = rows[0];
      const parent = Parent.fromDatabase(row);
        
      const vehicle = Vehicle.fromDatabase(row);
      vehicle.setParent(parent);
      
      return vehicle;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch vehicle');
    }
  }

  /**
   * Find vehicles by parent ID
   * @param {number} parentId - Parent ID
   * @returns {Promise<Array>} Array of vehicles
   */
  async findByParentId(parentId) {
    try {
      const [rows] = await db.query('SELECT * FROM Vehicle WHERE parent_id = ?', [parentId]);
      if (!rows || rows.length === 0) {
        return [];
      }
      return rows.map(row => new Vehicle(row.id, row.parent_id, row.available_seats));
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch vehicles by parent ID');
    }
  }

  /**
   * Create a new vehicle
   * @param {Object} vehicle - Vehicle data
   * @returns {Promise<Object>} Created vehicle
   */
  async create(vehicle) {
    try {
      const [result] = await db.query(
        'INSERT INTO Vehicle (parent_id, available_seats) VALUES (?, ?)',
        [vehicle.parentId, vehicle.availableSeats]
      );
      return new Vehicle(result.insertId, vehicle.parentId, vehicle.availableSeats);
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to create vehicle');
    }
  }

  /**
   * Update a vehicle
   * @param {Object} vehicle - Vehicle data with ID
   * @returns {Promise<Object>} Updated vehicle
   */
  async update(vehicleId, vehicle) {
    try {
      await db.query(
        'UPDATE Vehicle SET parent_id = ?, available_seats = ? WHERE id = ?',
        [vehicle.parentId, vehicle.availableSeats, vehicleId]
      );
      return vehicle;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to update vehicle');
    }
  }

  /**
   * Delete a vehicle by ID
   * @param {number} id - Vehicle ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async delete(id) {
    try {
      await db.query('DELETE FROM Vehicle WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to delete vehicle');
    }
  }

  /**
   * Vérifie si un véhicule est associé à des transports
   * @param {number} vehicleId - ID du véhicule à vérifier
   * @returns {Promise<boolean>} True si le véhicule est utilisé dans des transports, false sinon
   */
  async isUsedInTransports(vehicleId) {
    try {
      const [rows] = await db.query(`
        SELECT COUNT(*) as count
        FROM transports
        WHERE vehicle_id = ?
        `, [vehicleId]
      );
      
      // Si le nombre est supérieur à 0, le véhicule est utilisé
      return rows[0].count > 0;
    } catch (error) {
      console.error('Error checking if vehicle is used in transports:', error);
      throw new Error('Failed to check vehicle usage');
    }
  }

  /**
   * Find available vehicles with sufficient seats
   * @param {number} requiredSeats - Number of seats required
   * @returns {Promise<Array>} Array of available vehicles
   */
  async findAvailableVehicles(requiredSeats) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Vehicle WHERE available_seats >= ?',
        [requiredSeats]
      );
      if (!rows || rows.length === 0) {
        return [];
      }
      return rows.map(row => new Vehicle(row.id, row.parent_id, row.available_seats));
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch available vehicles');
    }
  }
}

module.exports = new VehicleRepository();