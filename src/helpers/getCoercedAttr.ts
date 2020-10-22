import { Basic } from '../types';

interface CoercionFunction {
  (arg?: Basic | null): Basic;
}

const getCoercedAttr = (
  element: HTMLElement,
  attrName: string,
  coercionFunction: CoercionFunction
): Basic => {
  return coercionFunction === Boolean
    ? element.hasAttribute(attrName)
    : coercionFunction(element.getAttribute(attrName));
};

export default getCoercedAttr;
