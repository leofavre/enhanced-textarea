const resetProp = <T>(element: T, propName: string): void => {
  const value = element[propName];
  delete element[propName];
  element[propName] = value;
};

export default resetProp;
