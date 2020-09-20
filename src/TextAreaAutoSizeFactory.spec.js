jest.mock('./helpers/getCoercedAttr.js');
jest.mock('./helpers/setAttr.js');

import getCoercedAttr from './helpers/getCoercedAttr.js';
import setAttr from './helpers/setAttr.js';
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

  describe('.textElement', () => {
    test('Return the instance itself', () => {
      expect(element.textElement).toBe(element);
    });
  });

  describe('.autoheight', () => {
    test('Calls getCoercedAttr on get', () => {
      element.autoheight;
      const expectedArgs = [element, 'autoheight', Boolean];
      expect(getCoercedAttr).toHaveBeenCalledWith(...expectedArgs);
    });

    test('Calls setAttr on set', () => {
      element.autoheight = true;
      const expectedArgs = [element, 'autoheight', true];
      expect(setAttr).toHaveBeenCalledWith(...expectedArgs);
    });
  });

  describe('.value', () => {
    let descriptor;

    beforeEach(() => {
      BaseClass = class {};

      Object.defineProperty(BaseClass.prototype, 'value', {
        get: jest.fn(),
        set: jest.fn()
      });

      descriptor = Object
        .getOwnPropertyDescriptor(BaseClass.prototype, 'value');

      Element = TextAreaAutoSizeFactory(BaseClass);
      element = new Element();
      element._handleChange = jest.fn();
    });

    test('Gets super.value', () => {
      element.value;
      expect(descriptor.get).toHaveBeenCalled();
    });

    test('Sets super.value', () => {
      element.value = 50;
      expect(descriptor.set).toHaveBeenCalled();
    });

    test('Calls _handleChange on set', () => {
      element.value = 50;
      expect(element._handleChange).toHaveBeenCalled();
    });
  });
});
