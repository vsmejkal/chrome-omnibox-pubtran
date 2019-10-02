export default Storage = {
  async get(key, defaultValue = null) {
    let result = await this.getAll([key]);

    return (key in result) ? result[key] : defaultValue;
  },

  async getAll(keys) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(keys, result => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(result);
        }
      });
    });
  },

  async set(key, value) {
    await this.setAll({ [key]: value });
  },

  async setAll(items) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(items, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    });
  },

  async update(key, updater) {
    let value = await this.get(key);

    await this.set(key, updater(value));
  },

  async remove(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.remove(key, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    });
  },

  onChange: {
    _observers: [],

    subscribe(observer) {
      this._observers.push(observer);
    },

    notify(key, value) {
      this._observers.forEach(observer => observer(key, value));
    }
  }
}

chrome.storage.onChanged.addListener(function(changes) {
  for (let key in changes) {
    Storage.onChange.notify(key, changes[key].newValue);
  }
})
