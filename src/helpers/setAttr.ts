import { Basic } from '../types';

const setAttr = (
  element: HTMLElement,
  attrName: string,
  value?: Basic | null
): void => {
  if (value == null || value === false) {
    element.removeAttribute(attrName);
  } else {
    const parsedValue = value === true ? '' : value;
    element.setAttribute(attrName, String(parsedValue));
  }
};

export default setAttr;
