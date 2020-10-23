import { Maybe } from '../types';

const pxToNumber = (str: string): Maybe<number> => {
  const isPxMeasure = /[0-9-.].*?px$/.test(str);

  if (!isPxMeasure) {
    return undefined;
  }

  const parsedValue = Number(str.replace(/px$/, ''));

  return !Number.isNaN(parsedValue)
    ? parsedValue
    : undefined;
};

export default pxToNumber;
