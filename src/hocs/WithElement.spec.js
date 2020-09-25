import getCoercedAttr from '../helpers/getCoercedAttr.js';
import setAttr from '../helpers/setAttr.js';
import resetProp from '../helpers/resetProp.js';
import WithElement from './WithElement.js';

jest.mock('../helpers/getCoercedAttr.js');
jest.mock('../helpers/setAttr.js');
jest.mock('../helpers/resetProp.js');

let Base;
let Element;
let element;
let baseElement;

describe('WithElement', () => {
  let createElementSpy;

  beforeEach(() => {
    baseElement = {};

    createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation(() => ({
        innerHTML: '',
        content: {
          cloneNode: jest.fn()
        }
      }));

    Base = class {};

    Base.prototype.attachShadow = jest.fn(() => ({
      appendChild: jest.fn(),
      querySelector: jest.fn(() => baseElement)
    }));

    Element = WithElement(Base);
    element = new Element();
  });

  afterEach(() => {
    createElementSpy.mockReset();
  });

  it('Uses an empty class as default parameter', () => {
    WithElement();
  });

  it('Returns a class that extends another passed as parameter', () => {
    expect(Element.prototype).toBeInstanceOf(Base);
  });

  describe('.autoheight', () => {
    it('Calls getCoercedAttr on get', () => {
      element.autoheight;
      const expectedArgs = [element.baseElement, 'autoheight', Boolean];
      expect(getCoercedAttr).toHaveBeenCalledWith(...expectedArgs);
    });

    it('Calls setAttr on set', () => {
      element.autoheight = true;
      const expectedArgs = [element.baseElement, 'autoheight', true];
      expect(setAttr).toHaveBeenCalledWith(...expectedArgs);
    });
  });

  describe('.value', () => {
    let descriptor;

    beforeEach(() => {
      Object.defineProperty(baseElement, 'value', {
        get: jest.fn(),
        set: jest.fn()
      });

      descriptor = Object.getOwnPropertyDescriptor(baseElement, 'value');

      Element = WithElement(Base);
      element = new Element();
      element._handleChange = jest.fn();
    });

    it('Gets super.value', () => {
      element.value;
      expect(descriptor.get).toHaveBeenCalled;
    });

    it('Sets super.value', () => {
      element.value = 50;
      expect(descriptor.set).toHaveBeenCalled;
    });

    it('Calls _handleChange on set', () => {
      element.value = 50;
      expect(element._handleChange).toHaveBeenCalled;
    });
  });

  describe('.attributeChangedCallback()', () => {
    beforeEach(() => {
      element._handleAttributeChange = jest.fn();
    });

    it('Calls super.attributeChangedCallback forwarding arguments', () => {
      Base.prototype.attributeChangedCallback = jest.fn();
      Element = WithElement(Base);
      element = new Element();
      element._handleAttributeChange = jest.fn();

      const args = ['attrName', null, 20];
      element.attributeChangedCallback(...args);
      expect(Base.prototype.attributeChangedCallback)
        .toHaveBeenCalledWith(...args);
    });

    it('Calls _handleAttributeChange forwarding arguments', () => {
      const args = ['attrName', null, 20];
      element.attributeChangedCallback(...args);
      expect(element._handleAttributeChange)
        .toHaveBeenCalledWith(...args);
    });
  });

  describe('.connectedCallback()', () => {
    beforeEach(() => {
      element._handleResizeEventStart = jest.fn();
    });

    it('Calls super.connectedCallback', () => {
      Base.prototype.connectedCallback = jest.fn();
      Element = WithElement(Base);
      element = new Element();
      element._handleResizeEventStart = jest.fn();

      element.connectedCallback();
      expect(Base.prototype.connectedCallback).toHaveBeenCalled;
    });

    it('Calls resetProp passing autoheight', () => {
      element.connectedCallback();
      expect(resetProp).toHaveBeenCalledWith(element, 'autoheight');
    });

    it('Calls _handleResizeEventStart', () => {
      element.connectedCallback();
      expect(element._handleResizeEventStart).toHaveBeenCalled;
    });
  });
});
