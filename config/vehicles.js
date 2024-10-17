class Scooty {
  static farePerKm = 15;
  static baseFare = 50;

  static async priceEstimate(origin, destination, surgeMultiplier) {
    return (
      Scooty.baseFare +
      Scooty.calculateDistance(origin, destination) * Scooty.farePerKm +
      surgeMultiplier
    );
  }

  static async calculateDistance(origin, destination) {
    try {
      console.log("Calculating distance...");
      console.log(`Origin: ${origin}`);
      console.log(`Destination: ${destination}`);
      const response = await client.distancematrix({
        params: {
          origins: [`${origin.lat},${origin.long}`],
          destinations: [`${destination.lat},${destination.long}`],
          key: process.env.GOOGLE_MAPS_PLATFORM_API_KEY,
          mode: "bicycling",
        },
      });

      const distance = response.data.rows[0].elements[0].distance;
      const duration = response.data.rows[0].elements[0].duration;

      console.log(`Distance: ${distance.text}`);
      console.log(`Duration: ${duration.text}`);
    } catch (error) {
      console.error("Error:", error.response);
    }
  }
}

class TruckType1 {
  static farePerKm = 150;
  static baseFare = 500;

  static async priceEstimate(origin, destination, surgeMultiplier) {
    return (
      TruckType1.baseFare +
      TruckType1.calculateDistance(origin, destination) * TruckType1.farePerKm +
      surgeMultiplier
    );
  }

  static async calculateDistance(origin, destination) {
    try {
      const response = await client.distancematrix({
        params: {
          origins: [origin],
          destinations: [destination],
          key: process.env.GOOGLE_MAPS_PLATFORM_API_KEY,
          mode: "driving",
        },
      });

      const distance = response.data.rows[0].elements[0].distance;
      const duration = response.data.rows[0].elements[0].duration;

      console.log(`Distance: ${distance.text}`);
      console.log(`Duration: ${duration.text}`);
    } catch (error) {
      console.error("Error:", error.response.data.error_message);
    }
  }
}

module.exports = { Scooty, TruckType1 };
