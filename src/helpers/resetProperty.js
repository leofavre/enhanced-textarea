export default function resetProperty (propName) {
  const value = this[propName];
  delete this[propName];
  this[propName] = value;
}
