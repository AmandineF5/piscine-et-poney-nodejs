class Vehicle {
  constructor(id, parentId, availableSeats) {
    this.id = id; 
    this.parentId = parentId;
    this.availableSeats = availableSeats;

    this.parent = null
  }

  setParent(parent) {
    this.parent = parent;
    return this;
  }

  static fromDatabase(row) {
    return new Vehicle(
      row.v_id || row.id,
      row.parent_id,
      row.available_seats
    )
  }

}
module.exports = Vehicle;
