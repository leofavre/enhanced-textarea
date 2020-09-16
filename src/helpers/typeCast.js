export default function typeCast (attrName, type = String) {
  return type === Boolean
    ? this.hasAttribute(attrName)
    : type(this.getAttribute(attrName) || null);
}
