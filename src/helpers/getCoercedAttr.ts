type IcoercionFn = (attrValue: string | null) => unknown;

interface IgetCoercedAttr {
  (element: HTMLElement, attrName: string, coercionFn: IcoercionFn): unknown
}

const getCoercedAttr: IgetCoercedAttr = (...args) => {
  const [element, attrName, coercionFn] = args;

  return coercionFn === Boolean
    ? element.hasAttribute(attrName)
    : coercionFn(element.getAttribute(attrName));
};

export default getCoercedAttr;
