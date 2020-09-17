export default function getCoercedAttr (attrName, type = String) {
  return type === Boolean
    ? this.hasAttribute(attrName)
    : type(this.getAttribute(attrName) || null);
}
