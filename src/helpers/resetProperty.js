export default function (propName) {
  const value = this[propName];
  delete this[propName];
  this[propName] = value;
}
