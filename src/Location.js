import Cities from './Cities.js'

export default {
  async getCurrentPosition() {
    return new Promise(resolve => 
      navigator.geolocation.getCurrentPosition(position => resolve(position.coords))
    );
  },

  async getCurrentCity() {
    const position = await this.getCurrentPosition()
    const city = await Cities.findNearest(position);
    
    return city
  }
}