class Child {
  constructor(id, name, parentId) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.activities = [];
    this.parent = null;
  }

  addActivity(activity) {
    this.activities.push(activity);
    return this;
  }

  setParent(parent) {
    this.parent = parent;
  }

  static fromDatabase(row) {
    return new Parent(
      row.c_id || row.id,
      row.name,
      row.parent_id
    )
  }
}

module.exports = Child;