export default {
  isNotEmpty(string) {
    return string.trim().length > 0;
  },

  normalize(string) {
    return string.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 
}
