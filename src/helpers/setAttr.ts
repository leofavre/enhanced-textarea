import { AttrName, BasicPrimitive } from '../types';

type Args = [HTMLElement, AttrName, (BasicPrimitive | null)?];

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
