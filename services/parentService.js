const parentRepository = require('../repositories/parentRepository');
const Parent = require('../models/parentModel');

class ParentService {
  async getAllParents() {
    return await parentRepository.findAll();
  }
  
  async getParentById(id) {
    const parent = await parentRepository.findById(id);
    if (!parent) {
      throw new Error('Parent not found');
    }
    return parent;
  }

    async getParentByIdWithChildren(id) {
    const parent = await parentRepository.findByIdWithChildren(id);
    if (!parent) {
      throw new Error('Parent not found');
    }
    return parent;
  }
  
  async createParent(parentData) {
    this._validateParentData(parentData);
    const parent = new Parent(null, parentData.name, parentData.email, parentData.phone);

    return await parentRepository.create(parent);
  }
  
  async updateParent(id, parentData) {
    const existingParent = await parentRepository.findById(id);
    if (!existingParent) {
      throw new Error('Parent not found');
    }
    
    this._validateParentData(parentData);
    
    return await parentRepository.update(id, parentData);
  }
  
  async deleteParent(id) {
    const existingParent = await parentRepository.findById(id);
    if (!existingParent) {
      throw new Error('Parent not found');
    }
    
    await parentRepository.delete(id);
    return true;
  }
  
  _validateParentData(data) {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Parent name is required');
    }
    
    if (!data.name || data.name.trim() === '') {
      throw new Error('Parent name is required');
    }

    if (!data.email || data.email.trim() === '') {
      throw new Error('Parent email is required');
    }

    if (!data.email.includes('@')) {
      throw new Error('Invalid email format, must contain @');
    }

    if (!data.phone || data.phone.trim() === '') {
      throw new Error('Parent phone is required');
    }

    const phoneRegex = /^(06|07)[0-9]{8}$/;
    if (!phoneRegex.test(data.phone)) {
      throw new Error('Invalid phone format, must start with 06 or 07 and contain 10 digits');
    }
  }
}

module.exports = new ParentService();
