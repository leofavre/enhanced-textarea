import resetProp from './resetProp.js';

describe('resetProp', () => {
  test('Deletes and then resets a property from an object', () => {
    let descriptor;

    const element = {
      get height () { return this._height; },
      set height (val) { this._height = val; }
    };

    element.height = 50;

    descriptor = Object.getOwnPropertyDescriptor(element, 'height');
    expect(typeof descriptor.get).toBe('function');
    expect(typeof descriptor.set).toBe('function');
    expect(descriptor.value).toBe(undefined);

    resetProp(element, 'height');

    descriptor = Object.getOwnPropertyDescriptor(element, 'height');
    expect(descriptor.get).toBe(undefined);
    expect(descriptor.set).toBe(undefined);
    expect(descriptor.value).toBe(50);
  });
});
