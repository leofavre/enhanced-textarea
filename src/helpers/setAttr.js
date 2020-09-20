const setAttr = (element, attrName, value) => {
  if (value == null || value === false) {
    element.removeAttribute(attrName);
  } else {
    const parsedValue = value === true ? '' : value;
    element.setAttribute(attrName, parsedValue);
  }
};

export default setAttr;
