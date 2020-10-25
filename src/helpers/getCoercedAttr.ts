type ICoercionFn = (attrValue: string | null) => unknown;

export interface IGetCoercedAttr {
  (element: HTMLElement, attrName: string, coercionFn: ICoercionFn): unknown
}

const getCoercedAttr: IGetCoercedAttr = (...args) => {
  const [element, attrName, coercionFn] = args;

  return coercionFn === Boolean
    ? element.hasAttribute(attrName)
    : coercionFn(element.getAttribute(attrName));
};

export default getCoercedAttr;
