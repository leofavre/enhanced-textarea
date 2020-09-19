export default (element, propName) => {
  const value = element[propName];
  delete element[propName];
  element[propName] = value;
};
