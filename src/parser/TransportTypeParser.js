import TransportType from "/src/model/TransportType.js";
import StringUtil from "/src/StringUtil.js";

export default function parseTransportType(query) {
  query = StringUtil.normalize(query);

  switch (query) {
    case "autobus":
    case "bus":
      return TransportType.BUS;

    case "vlak":
      return TransportType.TRAIN;

    default:
      return null;
  }
}