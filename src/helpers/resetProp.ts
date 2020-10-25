interface IResetProp {
  <T>(element: T, propName: string): void
}

const resetProp: IResetProp = (element, propName) => {
  const value = element[propName];
  delete element[propName];
  element[propName] = value;
};

export default resetProp;
