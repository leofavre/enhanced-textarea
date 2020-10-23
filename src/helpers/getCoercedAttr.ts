import { AttrName, BasicPrimitive } from '../types';

type CoercionFunction = (arg?: BasicPrimitive | null) => BasicPrimitive;
type Args = [HTMLElement, AttrName, CoercionFunction];

const getCoercedAttr = (...args: Args): BasicPrimitive => {
  const [element, attrName, coercionFunction] = args;

  return coercionFunction === Boolean
    ? element.hasAttribute(attrName)
    : coercionFunction(element.getAttribute(attrName));
};

export default getCoercedAttr;
