export default arr => arr.map(item =>
  item != null && item.toLowerCase ? item.toLowerCase() : item);
