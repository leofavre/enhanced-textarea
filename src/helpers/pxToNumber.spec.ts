import pxToNumber from './pxToNumber';

describe('pxToNumber', () => {
  it('Extracts the numeric value from a measure in pixels', () => {
    expect(pxToNumber('20px')).toBe(20);
  });

  it('Handles negative and float values', () => {
    expect(pxToNumber('-0.875px')).toBe(-0.875);
  });

  it('Ignores invalid measures', () => {
    expect(pxToNumber('0px20')).toBeUndefined;
  });

  it('Ignores invalid measures that end with px', () => {
    expect(pxToNumber('-0.89-45.389px')).toBeUndefined;
  });

  it('Ignores entries that are not measures', () => {
    expect(pxToNumber('auto')).toBeUndefined;
  });

  it('Ignores empty strings', () => {
    expect(pxToNumber('')).toBeUndefined;
  });
});
