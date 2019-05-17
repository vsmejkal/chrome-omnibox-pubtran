function isNotEmpty(string) {
  return string.trim().length > 0;
}

function distance(position1, position2) {
  const dLat = position1.latitude - position2.latitude;
  const dLong = position1.longitude - position2.longitude;

  return Math.pow(dLat, 2) + Math.pow(dLong, 2)
}

class Cities {
  constructor(path) {
    const url = chrome.runtime.getURL(path);

    fetch(url)
      .then(response => response.text())
      .then(data => this._parseCities(data))
      .then(() => console.log(this.cities));
  }

  findNearest(position) {
    if (!Array.isArray(this.cities)) {
      return null;
    }
    
    this.cities
      .map((city) => ({ distance: distance(city, position), ...city }))
      .reduce((c1, c2) => c1.distance < c2.distance ? c1 : c2);
  }

  _parseCities(data) {
    this.cities = data.split('\n').filter(isNotEmpty).slice(1).map(line => {
      const [city, area, latitude, longitude] = line.split(',');
      return {
        city,
        area,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };
    });
  }
}

export default new Cities('data/czech-cities.csv')