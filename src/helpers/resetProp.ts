export interface IResetProp {
  <T>(record: T, propName: string): void
}

const resetProp: IResetProp = (record, propName) => {
  const value = record[propName];
  delete record[propName];
  record[propName] = value;
};

export default resetProp;
