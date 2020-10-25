import removeStyleProp from './removeStyleProp';

describe('removeStyleProp', () => {
  it('Returns a function', () => {
    expect(removeStyleProp('')).toBeInstanceOf(Function);
  });

  it('Returns undefined if it receives null', () => {
    expect(removeStyleProp('height')(null)).toBeNull();
  });

  it('Removes a property from a Style string', () => {
    const styleStr = 'height: 100px; width: 50px;';
    const result = 'width: 50px;';
    expect(removeStyleProp('height')(styleStr)).toBe(result);
  });

  it('Detects only complete property names in the beginning of the string', () => {
    const styleStr = 'height: 100px; line-height: 2;';
    const result = 'line-height: 2;';
    expect(removeStyleProp('height')(styleStr)).toBe(result);
  });

  it('Detects only complete property names after a space', () => {
    const styleStr = 'line-height: 2; height: 100px;';
    const result = 'line-height: 2;';
    expect(removeStyleProp('height')(styleStr)).toBe(result);
  });

  it('Detects only complete property names after a semicolon', () => {
    const styleStr = 'line-height: 2;height: 100px;';
    const result = 'line-height: 2;';
    expect(removeStyleProp('height')(styleStr)).toBe(result);
  });

  it('Detects only complete property names in the end of the string', () => {
    const styleStr = 'line-height: 2; height: 100px';
    const result = 'line-height: 2;';
    expect(removeStyleProp('height')(styleStr)).toBe(result);
  });
});
