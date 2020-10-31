interface IresetProp {
  <T>(objectLike: T, propName: string): void
}

const resetProp: IresetProp = (objectLike, propName) => {
  const value = objectLike[propName];
  delete objectLike[propName];
  objectLike[propName] = value;
};

export default resetProp;
