import removeStyleProp from './removeStyleProp.js';

describe('removeStyleProp', () => {
  test('Returns a function', () => {
    expect(typeof removeStyleProp()).toBe('function');
  });

  test('Returns the second parameter if it is not a string', () => {
    expect(typeof removeStyleProp('height')()).toBe('undefined');
  });

  test('Removes a property from a Style string', () => {
    const styleStr = 'height: 100px; width: 50px;';
    const result = 'width: 50px;';
    expect(removeStyleProp('height')(styleStr)).toBe(result);
  });
});
