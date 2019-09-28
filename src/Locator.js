import Gps from "/src/model/Gps.js";

let cachedPosition = {
  _value: null,
  _stamp: new Date(0),

  get isFresh() {
    return (new Date() - this._stamp) < 10 * 60 * 1000; // 10 min
  },

  get value() {
    return this._value;
  },

  set value (position) {
    this._value = position;
    this._stamp = new Date();
  }
};

export default {
  async fetchPosition() {
    return new Promise((resolve, reject) => {
      let onSuccess = ({ coords }) => {
        resolve(new Gps(coords.latitude, coords.longitude));
      };

      let onError = (error) => {
        if (cachedPosition.value) {
          resolve(cachedPosition.value);
        } else {
          reject(error);
        }
      };
      
      let options = { timeout: 1000 };

      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    });
  },

  /**
   * @returns {Promise<Gps>}
   */
  async getCurrentPosition() {
    if (!cachedPosition.isFresh) {
      cachedPosition.value = await this.fetchPosition();
    }

    return cachedPosition.value;
  }
}