class Scooty {
  static farePerKm = 15;
  static baseFare = 50;

  static priceEstimate(distance, surgeMultiplier) {
    return this.baseFare + distance * this.farePerKm + surgeMultiplier;
  }
}

class TruckType1 {
  static farePerKm = 150;
  static baseFare = 500;

  static priceEstimate(distance, surgeMultiplier) {
    return this.baseFare + distance * this.farePerKm + surgeMultiplier;
  }
}

module.exports = { Scooty, TruckType1 };
