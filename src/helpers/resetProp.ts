import { PropName } from '../types';

const resetProp = <T>(element: T, propName: PropName): void => {
  const value = element[propName];
  delete element[propName];
  element[propName] = value;
};

export default resetProp;
