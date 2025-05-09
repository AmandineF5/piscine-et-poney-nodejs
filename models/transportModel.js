class Transport { //TODO: à voir si on passe en DTO
  constructor(
    id,
    type,
    dateStart,
    dateEnd,
    pickupLocation,
    activityId,
    vehicleId,
  ) {
    this.id = id;
    this.type = type;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.pickupLocation = pickupLocation;
    this.activityId = activityId;
    this.vehicleId = vehicleId;
    
    // Objets imbriqués initialisés à null
    this.activity = null;
    this.vehicle = null;
  }

  static fromDatabase(row) {
    return new Transport(
      row.t_id || row.id,
      row.type,
      row.date_start,
      row.date_end,
      row.pickup_location,
      row.activity_id,
      row.vehicle_id
    )
  }

  setActivity(activity) {
    this.activity = activity;
    return this;
  }
  
  setVehicle(vehicle) {
    this.vehicle = vehicle;
    return this;
  }
}

module.exports = Transport;