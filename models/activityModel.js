class Activity {
  constructor(id, name, address) {
    this.id = id; 
    this.name = name;
    this.address = address;
  }

  static fromDatabase(row) {
    return new Activity(
      row.a_id || row.id,
      row.activity_name || row.name,
      row.activity_address || row.address
    )
  }
}

module.exports = Activity;

