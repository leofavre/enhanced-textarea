import resetProp from './resetProp';

describe('resetProp', () => {
  it('Deletes and then resets a property from an object', () => {
    let descriptor;

    const element = {
      get height () { return this._height; },
      set height (val) { this._height = val; }
    };

    element.height = 50;

    descriptor = Object.getOwnPropertyDescriptor(element, 'height');
    expect(descriptor.get).toBeInstanceOf(Function);
    expect(descriptor.set).toBeInstanceOf(Function);
    expect(descriptor.value).toBeUndefined;

    resetProp(element, 'height');

    descriptor = Object.getOwnPropertyDescriptor(element, 'height');
    expect(descriptor.get).toBeUndefined;
    expect(descriptor.set).toBeUndefined;
    expect(descriptor.value).toBe(50);
  });
});
