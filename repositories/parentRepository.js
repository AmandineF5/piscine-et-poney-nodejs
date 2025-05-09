const db = require('../config/database.js'); 
const Parent = require('../models/parentModel');

class ParentRepository {
  /**
   * Récupère tous les parents de la base de données
   * @returns {Promise<Parent[]>} Liste des parents
   */
  async findAll() {
    const [rows] = await db.query(`
      SELECT 
        p.id as p_id,
        p.name,
        p.email,
        p.phone
      FROM Parent p
    `);
    
    return rows[0].map(row => Parent.fromDatabase(row));
  }

  /**
   * Récupère un parent par son ID
   * @param {number} id - ID du parent à récupérer
   * @returns {Promise<Parent|null>} Le parent trouvé ou null
   */
  async findById(id) {
    const [rows] = await db.query(`
      SELECT 
        p.id as p_id,
        p.name,
        p.email,
        p.phone
      FROM Parent p
      WHERE p.id = ?
    `, [id]);

    if (rows && rows.length > 0) {
      return Parent.fromDatabase(rows[0]);
    }
    
    return null;
  }

  /**
   * Récupère un parent avec ses enfants
   * @param {number} id - ID du parent
   * @returns {Promise<Parent|null>} Parent avec ses enfants ou null
   */
  async findByIdWithChildren(id) {
    const [rows] = await db.query(`
      SELECT 
        p.id as p_id,
        p.name,
        p.email,
        p.phone,
        c.id as c_id,
        c.name as child_name,
      FROM Parent p
      LEFT JOIN Child c ON c.parent_id = p.id
      WHERE p.id = ?
    `, [id]);
    
    if (!rows || rows.length === 0) {
      return null;
    }
    
    // Créer le parent
    const parent = Parent.fromDatabase(rows[0][0]);
    
    // Regrouper les enfants
    const children = [];
    rows.forEach(row => {
      if (row.c_id) {
        children.push({
          id: row.c_id,
          name: row.child_name
        });
      }
    });
    
    // Ajouter les enfants au parent
    if (children.length > 0) {
      parent.setChildren(children);
    }
    
    return parent;
  }

  /**
   * Crée un nouveau parent
   * @param {Object} parentData - Données du parent à créer
   * @returns {Promise<Parent>} Le parent créé
   */
  async create(parentData) {
    const [result] = await db.query(`
      INSERT INTO Parent (name, email, phone)
      VALUES (?, ?, ?)
    `, [parentData.name, parentData.email, parentData.phone]);
    
    const newParent = new Parent({
      id: result.insertId,
      name: parentData.name,
      email: parentData.email,
      phone: parentData.phone
    });
    
    return newParent;
  }

  /**
   * Met à jour un parent existant
   * @param {number} id - ID du parent à mettre à jour
   * @param {Object} parentData - Nouvelles données
   * @returns {Promise<Parent|null>} Le parent mis à jour ou null
   */
  async update(id, parentData) {
    const [result] = await db.query(`
      UPDATE Parent
      SET name = ?, email = ?, phone = ?
      WHERE id = ?
    `, [parentData.name, parentData.email, parentData.phone, id]);
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return this.findById(id);
  }

  /**
   * Supprime un parent par son ID
   * @param {number} id - ID du parent à supprimer
   * @returns {Promise<boolean>} true si supprimé, false sinon
   */
  async delete(id) {
    const [result] = await db.query(`
      DELETE FROM Parent
      WHERE id = ?
    `, [id]);
    
    return result.affectedRows > 0;
  }
}

module.exports = new ParentRepository();
