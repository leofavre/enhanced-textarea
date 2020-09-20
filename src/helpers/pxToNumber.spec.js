import pxToNumber from './pxToNumber.js';

describe('pxToNumber', () => {
  test('Extracts the numeric value from a measure in pixels', () => {
    expect(pxToNumber('20px')).toBe(20);
  });

  test('Handles negative and float values', () => {
    expect(pxToNumber('-0.875px')).toBe(-0.875);
  });

  test('Ignores invalid measures', () => {
    expect(pxToNumber('0px20')).toBe(undefined);
  });

  test('Ignores non-measures', () => {
    expect(pxToNumber('auto')).toBe(undefined);
  });
});
