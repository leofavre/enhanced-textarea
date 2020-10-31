interface IsetAttr {
  (element: HTMLElement, attrName: string, value?: unknown): void
}

const setAttr: IsetAttr = (...args) => {
  const [element, attrName, value] = args;

  if (value == null || value === false) {
    element.removeAttribute(attrName);
  } else {
    const parsedValue = value === true ? '' : value;
    element.setAttribute(attrName, String(parsedValue));
  }
};

export default setAttr;
