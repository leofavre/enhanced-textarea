export default (element, attrName, type = String) => {
  return type === Boolean
    ? element.hasAttribute(attrName)
    : type(element.getAttribute(attrName) || null);
};
