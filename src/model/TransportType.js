export default class TransportType {
    static ALL = new TransportType("vlakyautobusy", "spojení", "");
    static BUS = new TransportType("autobusy", "autobus", "bus");
    static TRAIN = new TransportType("vlaky", "vlak", "vlak");

    constructor(id, label, query) {
      this.id = id;
      this.label = label;
      this.query = query;
    }

    toHumanString() {
        return this.label;
    }

    toString() {
        return this.query;
    }
}
