export default {
  isNotEmpty: (string) => string.trim().length > 0,

  normalize: (string) => string.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
