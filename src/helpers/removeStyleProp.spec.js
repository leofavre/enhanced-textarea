import removeStyleProp from './removeStyleProp.js';

describe('removeStyleProp', () => {
  it('Returns a function', () => {
    expect(removeStyleProp()).toBeInstanceOf(Function);
  });

  it('Returns the second parameter if it is not a string', () => {
    expect(removeStyleProp('height')(20)).toBe(20);
  });

  it('Removes a property from a Style string', () => {
    const styleStr = 'height: 100px; width: 50px;';
    const result = 'width: 50px;';
    expect(removeStyleProp('height')(styleStr)).toBe(result);
  });
});
