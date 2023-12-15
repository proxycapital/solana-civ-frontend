function toCamelCase(str: string) {
  if (!str) return '';

  return str
    .replace(/[^a-zA-Z\s]/g, "")
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

function capitalizeWords(str: string) {
  if (!str) return '';

  return str
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

}

export {
  toCamelCase,
  capitalizeWords,
}