interface IGetCoercedAttr {
  (
    element: HTMLElement,
    attrName: string,
    coercionFunction: (attrValue: string | null) => unknown
  ): unknown
}

const getCoercedAttr: IGetCoercedAttr = (...args) => {
  const [element, attrName, coercionFunction] = args;

  return coercionFunction === Boolean
    ? element.hasAttribute(attrName)
    : coercionFunction(element.getAttribute(attrName));
};

export default getCoercedAttr;
