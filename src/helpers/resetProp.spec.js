import resetProp from './resetProp.js';
import sinon from 'sinon';

describe('resetProp', () => {
  test('Deletes and then resets a property from an object', () => {
    const getSpy = sinon.spy();
    const setSpy = sinon.spy();

    const element = {
      get height () { getSpy(); return this._height; },
      set height (val) { setSpy(); this._height = val; }
    };

    element.height = 50;

    resetProp(element, 'height');

    expect(setSpy).toHaveBeenCalledOnce();
    expect(setSpy).toHaveBeenCalledBefore(getSpy);
    expect(getSpy).toHaveBeenCalledOnce();
    expect(setSpy).not.toHaveBeenCalledAfter(getSpy);
    expect(element.height).toBe(50);
  });
});
