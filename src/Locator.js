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
    if (position) {
      this._value = position;
      this._stamp = new Date();
    }
  }
};

export default {
  async fetchPosition(timeout) {
    return new Promise((resolve) => {
      let onSuccess = ({ coords }) => {
        resolve(new Gps(coords.latitude, coords.longitude));
      };

      let onError = (error) => {
        console.warn("Cannot get position:", error);
        resolve(cachedPosition.value);
      };
      
      let options = { timeout };

      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    });
  },

  /**
   * @returns {Promise<Gps>}
   */
  async getCurrentPosition(timeout = 3000) {
    if (!cachedPosition.isFresh) {
      cachedPosition.value = await this.fetchPosition(timeout);
    }

    return cachedPosition.value;
  }
}