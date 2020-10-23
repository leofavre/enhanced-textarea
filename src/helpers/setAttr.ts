type Primitive = string | number | boolean;
type Args = [HTMLElement, string, (Primitive | null)?];

const setAttr = (...args: Args): void => {
  const [element, attrName, value] = args;

  if (value == null || value === false) {
    element.removeAttribute(attrName);
  } else {
    const parsedValue = value === true ? '' : value;
    element.setAttribute(attrName, String(parsedValue));
  }
};

export default setAttr;
