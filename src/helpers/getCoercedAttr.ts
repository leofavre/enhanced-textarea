import { AttrName } from '../types';

type Primitive = string | number | boolean;
type CoercionFunction = (arg?: Primitive | null) => Primitive;
type Args = [HTMLElement, AttrName, CoercionFunction];

const getCoercedAttr = (...args: Args): Primitive => {
  const [element, attrName, coercionFunction] = args;

  return coercionFunction === Boolean
    ? element.hasAttribute(attrName)
    : coercionFunction(element.getAttribute(attrName));
};

export default getCoercedAttr;
