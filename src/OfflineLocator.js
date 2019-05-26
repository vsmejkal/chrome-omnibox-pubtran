import Cities from './Cities.js'

const latestPosition = {
  value: null,
  stamp: new Date(0)
};

export default {
  async getPosition() {
    // Latest position is not older than 10 minutes
    if (new Date() - latestPosition.stamp < 10 * 60 * 1000) {
      return latestPosition.value;
    }

    return new Promise(resolve => 
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        latestPosition.value = coords;
        latestPosition.stamp = new Date();

        resolve(coords);
      })
    );
  },

  async getCity() {
    const position = await this.getPosition();
    const city = await Cities.findNearest(position);
    
    return city.name;
  }
}