const db = require('../config/database');
const Activity = require('../models/activityModel');
const Vehicle = require('../models/vehicleModel');
const Transport = require('../models/transportModel');
const Parent = require('../models/parentModel');

class TransportRepository {
   /**
   * Find all transports
   * @returns {Promise<Array>} Array of transports
   */
  async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT 
          t.*,
          a.id as a_id, a.name as activity_name, a.address as activity_address, 
          v.id as v_id, v.parent_id, v.available_seats,
          p.id as p_id, p.name, p.email, p.phone
        FROM Transport t
        JOIN Activity a ON t.activity_id = a.id
        JOIN Vehicle v ON t.vehicle_id = v.id
        LEFT JOIN Parent p ON v.parent_id = p.id
      `);
     
      if (rows?.length > 0) {
        return rows.map(row => {
          const activity = row.a_id ? Activity.fromDatabase(row) : null;
          const parent = row.p_id ? Parent.fromDatabase(row) : null;
          const vehicle = row.v_id ? Vehicle.fromDatabase(row) : null;
          vehicle.setParent(parent);
          const transport = Transport.fromDatabase(row);
          transport
            .setActivity(activity)
            .setVehicle(vehicle);
      return transport;
        }
      );
      } 
      return [];
      
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch transports');
    }
  }
  
  /**
   * Find a transport by its ID
   * @param {number} id - Transport ID
   * @returns {Promise<Object|null>} Transport data or null if not found
   */
  async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT 
          t.*,
          a.id as a_id, a.name as activity_name, a.address as activity_address, 
          v.id as v_id, v.parent_id, v.available_seats,
          p.id as p_id, p.name, p.email, p.phone
        FROM Transport t
        JOIN Activity a ON t.activity_id = a.id
        JOIN Vehicle v ON t.vehicle_id = v.id
        LEFT JOIN Parent p ON v.parent_id = p.id
        WHERE t.id = ?
      `, [id]);
      
      if (!rows || rows.length === 0) return null;
      const row = rows[0];
      const activity = row.a_id ? Activity.fromDatabase(row) : null;
      const parent = row.p_id ? Parent.fromDatabase(row) : null;
      const vehicle = row.v_id ? Vehicle.fromDatabase(row) : null;
      vehicle.setParent(parent);
      const transport = Transport.fromDatabase(row);
      transport
        .setActivity(activity)
        .setVehicle(vehicle);
    
      return transport;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch transport');
    }
  }
  
  /**
   * Find transports by activity ID
   * @param {number} activityId - Activity ID
   * @returns {Promise<Array>} Array of transports
   */
  async findByActivityId(activityId) {
    try {
      const [rows] = await db.query(`
        SELECT t.*, 
          a.id as a_id, a.name as activity_name, a.address as activity_address, 
          v.id as v_id, v.parent_id, v.available_seats,
          p.id as p_id, p.name, p.email, p.phone
        FROM Transport t
        JOIN Activity a ON t.activity_id = a.id
        JOIN Vehicle v ON t.vehicle_id = v.id
        LEFT JOIN Parent p ON v.parent_id = p.id
        WHERE t.activity_id = ?
      `, [activityId]);

      if (rows?.length > 0) {
        
        return rows.map(row => {
          const activity = new Activity(row);
          const parent = row.p_id ? new Parent(row) : null;
          const vehicle = Vehicle.fromDatabase(row);
          vehicle.setParent(parent);
          const transport = Transport.fromDatabase(row);
          transport
            .setActivity(activity)
            .setVehicle(vehicle);
          return transport;
        }
      );
      } else {
        return [];
      }
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch transports for activity');
    }
  }

  /**
   * Find transports by parent ID
   * @param {number} parentId - Parent ID
   * @returns {Promise<Array>} Array of transports
   */
  async findByParentId(parentId) {
    const [rows] = await db.query(`
    SELECT 
      t.*,
      a.id as a_id, a.name as activity_name, a.address as activity_address, 
      v.id as v_id, v.parent_id, v.available_seats,
      p.id as p_id, p.name as parent_name, p.email as parent_email, p.phone as parent_phone
    FROM Transport t
    JOIN Activity a ON t.activity_id = a.id
    JOIN Vehicle v ON t.vehicle_id = v.id
    LEFT JOIN Parent p ON v.parent_id = p.id
    WHERE v.parent_id = ?
    `, [parentId]);

    if (rows && rows.length > 0) {
      return rows.map(row => {
        const activity = Activity.fromDatabase(row);
        
        const parent = Parent.fromDatabase(row);
        
        const vehicle = Vehicle.fromDatabase(row);
        vehicle.setParent(parent);
        
        const transport = Transport.fromDatabase(row);
        
        return transport
          .setActivity(activity)
          .setVehicle(vehicle);
      });
    }
    return [];
  }
  
  /**
   * Crée un nouveau transport avec un véhicule associé
   * @param {Object} transportData - Données du transport et de son véhicle
   * @returns {Promise<Transport>} Le transport créé
   */
  async create(transportData){
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      // 1. Créer d'abord le véhicule
      const [vehicleResult] = await connection.query('INSERT INTO Vehicle (parent_id, available_seats) VALUES (?, ?) RETURNING id', 
        [transportData.vehicle.parent.id, transportData.vehicle.availableSeats]);
      const vehicleId = vehicleResult[0].id;

      // 2. Créer le transport avec le vehicleId obtenu
      const [transportResult] = await connection.query(`
        INSERT INTO Transport 
        (type, date_start, date_end, pickup_location, activity_id, vehicle_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        transportData.type,
        transportData.dateStart,
        transportData.dateEnd,
        transportData.pickupLocation,
        transportData.activity.id,
        vehicleId
      ]);
      
      await connection.commit();
      
      // Récupérer le transport complet avec ses relations
      return this.findById(transportResult.insertId);
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

 /**
 * Met à jour un transport existant et son véhicule associé
 * @param {number} id - Identifiant du transport à mettre à jour
 * @param {Object} transportData - Données du transport et de son véhicule à mettre à jour
 * @returns {Promise<Transport>} Le transport mis à jour
 */
async update(id, transportData) {
  const [transportRows] = await db.query(
    'SELECT * FROM Transport WHERE id = ?',
    [id]
  );

  if (!transportRows || transportRows.length === 0) {
    throw new Error('Transport not found');
  }
  
  const vehicleId = transportRows[0].vehicle_id;
  
  // Démarrer une transaction
  const connection = await db.getConnection();
  await connection.beginTransaction();
  
  try {
    // Mettre à jour le transport si des données sont fournies
    if (transportData) {
      await connection.query(`
        UPDATE Transport 
        SET type = ?, 
            date_start = ?, 
            date_end = ?, 
            pickup_location = ?, 
            activity_id = ?
        WHERE id = ?
      `, [
        transportData.type,
        transportData.dateStart,
        transportData.dateEnd,
        transportData.pickupLocation,
        transportData.activity.id,
        id
      ]);
    }
    
    // Mettre à jour le véhicule si des données sont fournies et si le véhicule existe
    if (transportData.vehicle && vehicleId) {
      await connection.query(`
        UPDATE Vehicle 
        SET available_seats = ?
        WHERE id = ?
      `, [
        transportData.vehicle.availableSeats,
        vehicleId
      ]);
    }
    
    // Valider la transaction
    await connection.commit();
    
    // Retourner le transport mis à jour avec toutes ses données
    return this.findById(id);
    
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
  
  /**
   * Delete a transport by ID
   * @param {number} id - Transport ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async delete(id) {
    const transport = await this.findById(id);
    if (!transport) return false;
    
    const vehicleId = transport.vehicle ? transport.vehicle.id : null;
    
    // Utiliser une transaction pour garantir l'intégrité
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      // 1. Supprimer le transport
      const [transportResult] = await connection.query(`
        DELETE FROM Transport WHERE id = ?
      `, [id]);
      
      // 2. Si la suppression a réussi et qu'un véhicule est associé, le supprimer aussi
      if (transportResult.affectedRows > 0 && vehicleId) {
        await connection.query(`
          DELETE FROM Vehicle WHERE id = ?
        `, [vehicleId]);
      }
      
      await connection.commit();
      return transportResult.affectedRows > 0;
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new TransportRepository();
