jest.mock('./helpers/getCoercedAttr.js');

import getCoercedAttr from './helpers/getCoercedAttr.js';
import TextAreaAutoSizeFactory from './TextAreaAutoSizeFactory.js';

let BaseClass;
let Element;
let element;

describe('TextAreaAutoSizeFactory', () => {
  beforeEach(() => {
    BaseClass = class {};
    Element = TextAreaAutoSizeFactory(BaseClass);
    element = new Element();
  });

  test('Returns a class that extends BaseClass', () => {
    const ResultClass = TextAreaAutoSizeFactory(BaseClass);
    expect(ResultClass.prototype instanceof BaseClass).toBe(true);
  });

  describe('get autoheight', () => {
    test('Laser', () => {
      element.autoheight;
      const expectedArgs = [element, 'autoheight', Boolean];
      expect(getCoercedAttr).toHaveBeenCalledWith(...expectedArgs);
    });
  });
});
