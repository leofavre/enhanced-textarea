import pxToNumber from './pxToNumber.js';

describe('pxToNumber', () => {
  test('Extracts the numeric value from a measure in pixels', () => {
    expect(pxToNumber('20px')).toBe(20);
  });
});
