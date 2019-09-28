export default class Gps {
  /**
   * @param {Object} params
   * @param {number} params.latitude
   * @param {number} params.longitude
   */
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  /**
   * Squared Euclidean distance to other position
   * 
   * @param {Gps} other
   */
  distanceTo(other) {
    let dLat = this.latitude - other.latitude;
    let dLon = this.longitude - other.longitude;

    return dLat * dLat + dLon * dLon;
  }
}