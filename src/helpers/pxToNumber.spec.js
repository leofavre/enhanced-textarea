import pxToNumber from './pxToNumber.js';

describe('pxToNumber', () => {
  test('Extracts the numeric value from a measure in pixels', () => {
    expect(pxToNumber('20px')).toBe(20);
  });

  test('Handles negative and float values', () => {
    expect(pxToNumber('-0.875px')).toBe(-0.875);
  });

  test('Ignores invalid measures', () => {
    expect(pxToNumber('0px20')).toBeUndefined;
  });

  test('Ignores invalid measures that end with px', () => {
    expect(pxToNumber('-0.89-45.389px')).toBeUndefined;
  });

  test('Ignores entries that are not measures', () => {
    expect(pxToNumber('auto')).toBeUndefined;
  });

  test('Ignores empty strings', () => {
    expect(pxToNumber('')).toBeUndefined;
  });

  test('Ignores undefined entries', () => {
    expect(pxToNumber()).toBeUndefined;
  });
});
