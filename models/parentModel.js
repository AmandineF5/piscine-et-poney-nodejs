class Parent {
  constructor(id, name, email, phone) {
    this.id = id; 
    this.name = name; 
    this.email = email; 
    this.phone = phone;  

    this.children = null;
  }

  setChildren(children) {
    this.children = children;
    return this;
  }

  static fromDatabase(row) {
    return new Parent(
      row.p_id || row.id,
      row.name,
      row.email,
      row.phone
    )
  }
}

module.exports = Parent;