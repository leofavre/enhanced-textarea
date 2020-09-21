import getCoercedAttr from './helpers/getCoercedAttr.js';
import setAttr from './helpers/setAttr.js';
import resetProp from './helpers/resetProp.js';
import TextAreaAutoSizeFactory from './TextAreaAutoSizeFactory.js';

jest.mock('./helpers/getCoercedAttr.js');
jest.mock('./helpers/setAttr.js');
jest.mock('./helpers/resetProp.js');

let Base;
let Element;
let element;

describe('TextAreaAutoSizeFactory', () => {
  beforeEach(() => {
    Base = class {};
    Element = TextAreaAutoSizeFactory(Base);
    element = new Element();
  });

  test('Returns a class that extends another passed as parameter', () => {
    expect(Element.prototype).toBeInstanceOf(Base);
  });

  describe('.constructor()', () => {
    test('Makes sure _handleChange is always bound to the instance', () => {
      Element.prototype._handleChange = function () { return this; };
      element = new Element();
      const [result] = [1].map(element._handleChange);
      expect(result).toBe(element);
    });

    test('Makes sure _handleUserResize always is bound to the instance', () => {
      Element.prototype._handleUserResize = function () { return this; };
      element = new Element();
      const [result] = [1].map(element._handleUserResize);
      expect(result).toBe(element);
    });
  });

  describe('.textElement', () => {
    test('Returns the instance', () => {
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
      Base = class {};

      Object.defineProperty(Base.prototype, 'value', {
        get: jest.fn(),
        set: jest.fn()
      });

      descriptor = Object.getOwnPropertyDescriptor(Base.prototype, 'value');

      Element = TextAreaAutoSizeFactory(Base);
      element = new Element();
      element._handleChange = jest.fn();
    });

    test('Gets super.value', () => {
      element.value;
      expect(descriptor.get).toHaveBeenCalled;
    });

    test('Sets super.value', () => {
      element.value = 50;
      expect(descriptor.set).toHaveBeenCalled;
    });

    test('Calls _handleChange on set', () => {
      element.value = 50;
      expect(element._handleChange).toHaveBeenCalled;
    });
  });

  describe('static .observedAttributes', () => {
    test('Contains only expected attributes', () => {
      const expectedAttrs = [
        'autoheight',
        'rows',
        'cols',
        'class',
        'style'
      ];

      expect(Element.observedAttributes.sort()).toEqual(expectedAttrs.sort());
    });

    test('Extends super.observedAttributes', () => {
      const expectedAttrs = [
        'autoheight',
        'rows',
        'cols',
        'class',
        'style',
        'disabled',
        'readonly'
      ];

      Base = class {
        static get observedAttributes () {
          return ['disabled', 'readonly'];
        }
      };

      Element = TextAreaAutoSizeFactory(Base);
      element = new Element();

      expect(Element.observedAttributes.sort()).toEqual(expectedAttrs.sort());
    });
  });

  describe('.attributeChangedCallback()', () => {
    test('Calls super.attributeChangedCallback forwarding arguments', () => {
      Base.prototype.attributeChangedCallback = jest.fn();
      Element = TextAreaAutoSizeFactory(Base);
      element = new Element();
      const args = ['attrName', null, 20];
      element.attributeChangedCallback(...args);
      expect(Base.prototype.attributeChangedCallback)
        .toHaveBeenCalledWith(...args);
    });

    test('Does nothing when attribute stays the same', () => {
      element._handleAutoHeightStart = jest.fn();
      element._handleAutoHeightEnd = jest.fn();
      element._handleChange = jest.fn();
      element.attributeChangedCallback('rows', null, null);
      expect(element._handleAutoHeightStart).not.toHaveBeenCalled;
      expect(element._handleAutoHeightEnd).not.toHaveBeenCalled;
      expect(element._handleChange).not.toHaveBeenCalled;
    });

    test('Calls _handleAutoHeightStart when autoheight is set', () => {
      element._handleAutoHeightStart = jest.fn();
      element.attributeChangedCallback('autoheight', null, '');
      expect(element._handleAutoHeightStart).toHaveBeenCalled;
    });

    test('Calls _handleAutoHeightEnd when autoheight is unset', () => {
      element._handleAutoHeightEnd = jest.fn();
      element.attributeChangedCallback('autoheight', '', null);
      expect(element._handleAutoHeightEnd).toHaveBeenCalled;
    });

    test('Does not call _handleAutoHeightStart or _handleAutoHeightEnd ' +
      'when autoheight changes but is not set or unset', () => {
      element._handleAutoHeightStart = jest.fn();
      element._handleAutoHeightEnd = jest.fn();
      element.attributeChangedCallback('autoheight', '', 'autoheight');
      expect(element._handleAutoHeightStart).not.toHaveBeenCalled;
      expect(element._handleAutoHeightEnd).not.toHaveBeenCalled;
    });

    test('Calls _handleChange when any attribute but style changes', () => {
      element._handleChange = jest.fn();
      element.attributeChangedCallback('rows', '4', '2');
      expect(element._handleChange).toHaveBeenCalled;
    });

    test('Calls _handleChange when style properties ' +
      'except height or min-height change', () => {
      element._handleChange = jest.fn();
      const prevStyle = 'width: 100px;';
      const nextStyle = 'width: 150px;';
      element.attributeChangedCallback('style', prevStyle, nextStyle);
      expect(element._handleChange).toHaveBeenCalled;
    });

    test('Does not call _handleChange when only style properties ' +
      'height or min-height change', () => {
      element._handleChange = jest.fn();
      const prevStyle = 'height: 100px; min-height: 100px;';
      const nextStyle = 'height: 150px;';
      element.attributeChangedCallback('style', prevStyle, nextStyle);
      expect(element._handleChange).not.toHaveBeenCalled;
    });
  });

  describe('.connectedCallback()', () => {
    test('Calls super.connectedCallback', () => {
      Base.prototype.connectedCallback = jest.fn();
      Element = TextAreaAutoSizeFactory(Base);
      element = new Element();
      element.connectedCallback();
      expect(Base.prototype.connectedCallback).toHaveBeenCalled;
    });

    test('Calls resetProp passing autoheight', () => {
      element.connectedCallback();
      expect(resetProp).toHaveBeenCalledWith(element, 'autoheight');
    });
  });

  describe('._handleAutoHeightStart()', () => {
    let ResizeObserverSpy;

    beforeEach(() => {
      ResizeObserverSpy = jest.spyOn(ResizeObserver.prototype, 'observe');
      element.addEventListener = jest.fn();
    });

    afterEach(() => {
      ResizeObserverSpy.mockReset();
    });

    test('Observes textElement resize', () => {
      element._handleAutoHeightStart();
      expect(element._resizeObserver.observe)
        .toHaveBeenCalledWith(element.textElement);
    });

    test('Observes user interaction', () => {
      element._handleAutoHeightStart();

      expect(element.textElement.addEventListener)
        .toHaveBeenCalledWith('input', element._handleChange);

      expect(element.textElement.addEventListener)
        .toHaveBeenCalledWith('pointerup', element._handleUserResize);

      expect(element.textElement.addEventListener)
        .toHaveBeenCalledWith('pointerdown', element._handleUserResize);
    });
  });

  describe('._handleAutoHeightEnd()', () => {
    let ResizeObserverSpy;

    beforeEach(() => {
      ResizeObserverSpy = jest.spyOn(ResizeObserver.prototype, 'unobserve');
      element._resizeObserver = new ResizeObserver();
      element.removeEventListener = jest.fn();
    });

    afterEach(() => {
      ResizeObserverSpy.mockReset();
    });

    test('Stops observing textElement resize', () => {
      element._handleAutoHeightEnd();

      expect(element._resizeObserver.unobserve)
        .toHaveBeenCalledWith(element.textElement);
    });

    test('Stops observing user interaction', () => {
      element._handleAutoHeightEnd();

      expect(element.textElement.removeEventListener)
        .toHaveBeenCalledWith('input', element._handleChange);

      expect(element.textElement.removeEventListener)
        .toHaveBeenCalledWith('pointerup', element._handleUserResize);

      expect(element.textElement.removeEventListener)
        .toHaveBeenCalledWith('pointerdown', element._handleUserResize);
    });
  });

  describe('._handleChange()', () => {
    test('Does nothing if autoheight is undefined', () => {
      element._handleChange();
    });
  });

  describe('._handleUserResize()', () => {
    test('Does nothing if type is undefined', () => {
      element._handleUserResize();
    });

    test('Stores textElement dimensions on pointerdown', () => {
      element.textElement.offsetHeight = 50;
      element.textElement.offsetWidth = 100;

      element._handleUserResize({ type: 'pointerdown' });

      expect(element._preResizeHeight).toBe(50);
      expect(element._preResizeWidth).toBe(100);
    });

    test('Calls _handleChange after setting _resizedByUser to true ' +
      'if textElement was resized on pointerup', () => {
      let resizedByUser;

      element._preResizeHeight = 50;
      element._preResizeWidth = 100;

      element.textElement.offsetHeight = 55;
      element.textElement.offsetWidth = 105;

      element._handleChange = jest.fn(function () {
        resizedByUser = this._resizedByUser;
      });

      element._handleUserResize({ type: 'pointerup' });

      expect(element._handleChange).toHaveBeenCalled;
      expect(resizedByUser).toBe(true);
    });

    test('Sets _resizedByUser to false after calling _handleChange ' +
      'if textElement was resized on pointerup', () => {
      element._preResizeHeight = 50;
      element._preResizeWidth = 100;

      element.textElement.offsetHeight = 55;
      element.textElement.offsetWidth = 105;

      element._handleChange = jest.fn();
      element._handleUserResize({ type: 'pointerup' });

      expect(element._handleChange).toHaveBeenCalled;
      expect(element._resizedByUser).toBe(false);
    });

    test('Does not call _handleChange if textElement ' +
      'was not resized on pointerup', () => {
      element._preResizeHeight = 50;
      element._preResizeWidth = 100;

      element.textElement.offsetHeight = 50;
      element.textElement.offsetWidth = 100;

      element._handleChange = jest.fn();
      element._handleUserResize({ type: 'pointerup' });

      expect(element._handleChange).not.toHaveBeenCalled;
    });
  });

  describe('_getStyleProp()', () => {
    let getComputedStyleSpy;

    beforeEach(() => {
      getComputedStyleSpy = jest
        .spyOn(window, 'getComputedStyle')
        .mockImplementation(() => ({
          getPropertyValue: jest.fn(str => {
            return str === 'height' ? '20px' : '#909';
          })
        }));
    });

    afterEach(() => {
      getComputedStyleSpy.mockReset();
    });

    test('Returns the unprocessed value of a style property', () => {
      const result = element._getStyleProp('height');
      expect(result).toBe(20);
    });

    test('Returns the numeric value of a style property in pixels', () => {
      const result = element._getStyleProp('background');
      expect(result).toBe('#909');
    });
  });
});
