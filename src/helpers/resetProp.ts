import { AnyObject } from '../types';

const resetProp = (element: AnyObject, propName: string): void => {
  const value = element[propName];
  delete element[propName];
  element[propName] = value;
};

export default resetProp;
