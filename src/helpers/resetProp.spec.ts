import resetProp from './resetProp';

describe('resetProp', () => {
  it('Deletes and then resets a property from an object', () => {
    let descriptor: PropertyDescriptor;

    const record = {
      get height () { return this._height; },
      set height (val) { this._height = val; }
    };

    record.height = 50;

    descriptor =
      Object.getOwnPropertyDescriptor(record, 'height') as PropertyDescriptor;

    expect(descriptor.get).toBeInstanceOf(Function);
    expect(descriptor.set).toBeInstanceOf(Function);
    expect(descriptor.value).toBeUndefined();

    resetProp(record, 'height');

    descriptor =
      Object.getOwnPropertyDescriptor(record, 'height') as PropertyDescriptor;

    expect(descriptor.get).toBeUndefined();
    expect(descriptor.set).toBeUndefined();
    expect(descriptor.value).toBe(50);
  });
});
