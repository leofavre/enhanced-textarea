import WithAutoheight, { WithAutoheightBase, WithAutoheightDecorator, HTMLTextAreaElementWithAutoheight } from './WithAutoheight';
import { AttributeChangedCallbackArgs, Mutable } from '../types';

import getCoercedAttr from '../helpers/getCoercedAttr';
import setAttr from '../helpers/setAttr';
import resetProp from '../helpers/resetProp';

jest.mock('../helpers/getCoercedAttr');
jest.mock('../helpers/setAttr');
jest.mock('../helpers/resetProp');

type MockedElement = Mutable<HTMLTextAreaElementWithAutoheight & {
  _resizedByUser: boolean;
  _resizeObserver: ResizeObserver;
  _handleChange(): void;
  _handleResize(): void;
  _handleAttributeChange(...args: AttributeChangedCallbackArgs): void;
  _handleAutoheightStart(): void;
  _handleAutoheightEnd(): void;
  _getStyleProp(str: string): string | number | undefined;
}>;

let Base: WithAutoheightBase;
let Element: WithAutoheightDecorator;
let element: MockedElement;

describe('WithAutoheight', () => {
  beforeEach(() => {
    Base = class {} as unknown as WithAutoheightBase;
    Element = WithAutoheight(Base);
    element = new Element() as unknown as MockedElement;
  });

  it('Returns a class that extends another passed as parameter', () => {
    expect(Element.prototype).toBeInstanceOf(Base);
  });

  describe('.autoheight', () => {
    it('Calls getCoercedAttr on get', () => {
      element.autoheight; // eslint-disable-line no-unused-expressions
      const expectedArgs = [element, 'autoheight', Boolean];
      expect(getCoercedAttr).toHaveBeenCalledWith(...expectedArgs);
    });

    it('Calls setAttr on set', () => {
      element.autoheight = true;
      const expectedArgs = [element, 'autoheight', true];
      expect(setAttr).toHaveBeenCalledWith(...expectedArgs);
    });
  });

  describe('.value', () => {
    let descriptor: PropertyDescriptor;

    beforeEach(() => {
      Base = class {} as unknown as WithAutoheightBase;

      Object.defineProperty(Base.prototype, 'value', {
        get: jest.fn(),
        set: jest.fn()
      });

      descriptor = Object.getOwnPropertyDescriptor(
        Base.prototype, 'value') as PropertyDescriptor;

      Element = WithAutoheight(Base);
      element = new Element() as unknown as MockedElement;
      element._handleChange = jest.fn();
    });

    it('Gets super.value', () => {
      element.value; // eslint-disable-line no-unused-expressions
      expect(descriptor.get).toHaveBeenCalled();
    });

    it('Sets super.value', () => {
      element.value = '50';
      expect(descriptor.set).toHaveBeenCalled();
    });

    it('Calls _handleChange on set', () => {
      element.value = '50';
      expect(element._handleChange).toHaveBeenCalled();
    });
  });

  describe('static .observedAttributes', () => {
    it('Contains only expected attributes', () => {
      const expectedAttrs = [
        'autoheight',
        'rows',
        'cols',
        'class',
        'style'
      ];

      expect(Element.observedAttributes?.sort()).toEqual(expectedAttrs.sort());
    });

    it('Extends super.observedAttributes', () => {
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
      } as unknown as WithAutoheightBase;

      Element = WithAutoheight(Base);
      element = new Element() as unknown as MockedElement;

      expect(Element.observedAttributes?.sort()).toEqual(expectedAttrs.sort());
    });
  });

  describe('.attributeChangedCallback()', () => {
    beforeEach(() => {
      element._handleAttributeChange = jest.fn();
    });

    it('Calls super.attributeChangedCallback forwarding arguments', () => {
      Base.prototype.attributeChangedCallback = jest.fn();
      Element = WithAutoheight(Base);
      element = new Element() as unknown as MockedElement;
      element._handleAttributeChange = jest.fn();

      element.attributeChangedCallback('attrName', null, '20');
      expect(Base.prototype.attributeChangedCallback)
        .toHaveBeenCalledWith('attrName', null, '20');
    });

    it('Calls _handleAttributeChange forwarding arguments', () => {
      element.attributeChangedCallback('attrName', null, '20');
      expect(element._handleAttributeChange)
        .toHaveBeenCalledWith('attrName', null, '20');
    });
  });

  describe('.connectedCallback()', () => {
    beforeEach(() => {
      element._handleAutoheightStart = jest.fn();
    });

    it('Calls super.connectedCallback', () => {
      Base.prototype.connectedCallback = jest.fn();
      Element = WithAutoheight(Base);
      element = new Element() as unknown as MockedElement;
      element._handleAutoheightStart = jest.fn();

      element.connectedCallback();
      expect(Base.prototype.connectedCallback).toHaveBeenCalled();
    });

    it('Calls resetProp passing autoheight', () => {
      element.connectedCallback();
      expect(resetProp).toHaveBeenCalledWith(element, 'autoheight');
    });

    it('Calls _handleAutoheightStart', () => {
      element.connectedCallback();
      expect(element._handleAutoheightStart).toHaveBeenCalled();
    });
  });

  describe('.disconnectedCallback()', () => {
    beforeEach(() => {
      element._handleAutoheightEnd = jest.fn();
    });

    it('Calls super.disconnectedCallback', () => {
      Base.prototype.disconnectedCallback = jest.fn();
      Element = WithAutoheight(Base);
      element = new Element() as unknown as MockedElement;
      element._handleAutoheightEnd = jest.fn();

      element.disconnectedCallback();
      expect(Base.prototype.disconnectedCallback).toHaveBeenCalled();
    });

    it('Calls _handleAutoheightEnd', () => {
      element.disconnectedCallback();
      expect(element._handleAutoheightEnd).toHaveBeenCalled();
    });
  });

  describe('._handleAttributeChange', () => {
    beforeEach(() => {
      element.hasAttribute = jest.fn();
    });

    it('Does nothing when attribute stays the same', () => {
      element._handleAutoheightStart = jest.fn();
      element._handleAutoheightEnd = jest.fn();
      element._handleChange = jest.fn();
      element._handleAttributeChange('rows', null, null);
      expect(element._handleAutoheightStart).not.toHaveBeenCalled();
      expect(element._handleAutoheightEnd).not.toHaveBeenCalled();
      expect(element._handleChange).not.toHaveBeenCalled();
    });

    it('Calls _handleAutoheightStart when autoheight is set', () => {
      element._handleAutoheightStart = jest.fn();
      element._handleAttributeChange('autoheight', null, '');
      expect(element._handleAutoheightStart).toHaveBeenCalled();
    });

    it('Calls _handleAutoheightEnd when autoheight is unset', () => {
      element._handleAutoheightEnd = jest.fn();
      element._handleAttributeChange('autoheight', '', null);
      expect(element._handleAutoheightEnd).toHaveBeenCalled();
    });

    it('Does not call _handleAutoheightStart or _handleAutoheightEnd when autoheight changes but is not set or unset', () => {
      element._handleAutoheightStart = jest.fn();
      element._handleAutoheightEnd = jest.fn();
      element._handleAttributeChange('autoheight', '', 'autoheight');
      expect(element._handleAutoheightStart).not.toHaveBeenCalled();
      expect(element._handleAutoheightEnd).not.toHaveBeenCalled();
    });

    it('Calls _handleChange when any attribute but style changes', () => {
      element._handleChange = jest.fn();
      element._handleAttributeChange('rows', '4', '2');
      expect(element._handleChange).toHaveBeenCalled();
    });

    it('Calls _handleChange when style properties except height or min-height change', () => {
      element._handleChange = jest.fn();
      const prevStyle = 'width: 100px;';
      const nextStyle = 'width: 150px;';
      element._handleAttributeChange('style', prevStyle, nextStyle);
      expect(element._handleChange).toHaveBeenCalled();
    });

    it('Does not call _handleChange when only style properties height or min-height change', () => {
      element._handleChange = jest.fn();
      const prevStyle = 'height: 100px; min-height: 100px;';
      const nextStyle = 'height: 150px;';
      element._handleAttributeChange('style', prevStyle, nextStyle);
      expect(element._handleChange).not.toHaveBeenCalled();
    });
  });

  describe('._handleAutoheightStart()', () => {
    let ResizeObserverSpy: jest.SpyInstance;

    beforeEach(() => {
      ResizeObserverSpy = jest.spyOn(ResizeObserver.prototype, 'observe');
      element.addEventListener = jest.fn();
      element._handleAutoheightEnd = jest.fn();
    });

    afterEach(() => {
      ResizeObserverSpy.mockReset();
    });

    it('Reset listeners by calling _handleAutoheightEnd', () => {
      element._handleAutoheightStart();
      expect(element._handleAutoheightEnd).toHaveBeenCalled();
    });

    it('Observes user resize', () => {
      element._handleAutoheightStart();

      expect(element._resizeObserver.observe)
        .toHaveBeenCalledWith(element);
    });

    it('Observes user interaction', () => {
      element._handleAutoheightStart();

      expect(element.addEventListener)
        .toHaveBeenCalledWith('input', element._handleChange);

      expect(element.addEventListener)
        .toHaveBeenCalledWith('resize', element._handleResize);
    });
  });

  describe('._handleAutoheightEnd()', () => {
    let ResizeObserverSpy: jest.SpyInstance;

    beforeEach(() => {
      ResizeObserverSpy = jest
        .spyOn(ResizeObserver.prototype, 'unobserve');

      element._resizeObserver = new ResizeObserver(jest.fn());
      element.removeEventListener = jest.fn();
    });

    afterEach(() => {
      ResizeObserverSpy.mockReset();
    });

    it('Stops observing resize', () => {
      element._handleAutoheightEnd();

      expect(element._resizeObserver.unobserve)
        .toHaveBeenCalledWith(element);
    });

    it('Stops observing user interaction', () => {
      element._handleAutoheightEnd();

      expect(element.removeEventListener)
        .toHaveBeenCalledWith('input', element._handleChange);

      expect(element.removeEventListener)
        .toHaveBeenCalledWith('resize', element._handleResize);
    });
  });

  describe('._handleChange()', () => {
    beforeEach(() => {
      element._getStyleProp = jest.fn();

      Object.defineProperty(element, 'autoheight', {
        value: false,
        writable: true
      });
    });

    it('Does nothing if autoheight is undefined', () => {
      element.hasAttribute = () => false;
      element._handleChange();
    });

    it('Resizes considering padding and border if the box-sizing is not border-box', () => {
      element.hasAttribute = () => true;

      element.offsetHeight = 152;
      element.clientHeight = 150;
      element.scrollHeight = 195;
      element.style = { ...element.style, height: 'auto' };

      element._getStyleProp = jest.fn(str => {
        if (str === 'box-sizing') return 'content-box';
        if (str.startsWith('padding')) return 20;
        if (str.startsWith('border')) return 10;
      });

      element._handleChange();

      expect(element.style.minHeight).toBe('137px');
      expect(element.style.height).toBe('auto');
    });

    it('Resizes ignoring padding and border if the box-sizing is border-box', () => {
      element.hasAttribute = () => true;

      element.offsetHeight = 152;
      element.clientHeight = 150;
      element.scrollHeight = 195;
      element.style = { ...element.style, height: 'auto' };

      element._getStyleProp = jest.fn(str => {
        if (str === 'box-sizing') return 'border-box';
      });

      element._handleChange();

      expect(element.style.minHeight).toBe('197px');
      expect(element.style.height).toBe('auto');
    });

    it('Resizes when height is changed programmatically', () => {
      element.hasAttribute = () => true;

      element.offsetHeight = 152;
      element.clientHeight = 150;
      element.scrollHeight = 195;
      element.style = { ...element.style, height: '90px' };

      element._getStyleProp = jest.fn(str => {
        if (str === 'box-sizing') return 'border-box';
      });

      element._handleChange();

      expect(element.style.minHeight).toBe('197px');
      expect(element.style.height).toBe('90px');
    });

    it('Resizes when height is changed by user interaction but restricts it to min-height', () => {
      element.hasAttribute = () => true;
      element._resizedByUser = true;

      element.offsetHeight = 152;
      element.clientHeight = 150;
      element.scrollHeight = 195;
      element.style = { ...element.style, height: '90px' };

      element._getStyleProp = jest.fn(str => {
        if (str === 'box-sizing') return 'border-box';
      });

      element._handleChange();

      expect(element.style.minHeight).toBe('197px');
      expect(element.style.height).toBe('197px');
    });
  });

  describe('._handleResize()', () => {
    it('Class _handleChange after setting _resizedByUser to true and then sets _resizedByUser to false', () => {
      element._handleChange = jest.fn(function () {
        expect(element._resizedByUser).toBe(true);
      });

      element._handleResize();

      expect(element._handleChange).toHaveBeenCalled();
      expect(element._resizedByUser).toBe(false);
    });
  });

  describe('_getStyleProp()', () => {
    let getComputedStyleSpy: jest.SpyInstance;

    beforeEach(() => {
      const mockedGetComputedStyle = () => ({
        getPropertyValue: jest.fn(str => {
          return str === 'height' ? '20px' : '#909';
        })
      });

      getComputedStyleSpy = jest
        .spyOn(window, 'getComputedStyle')
        // @ts-ignore
        .mockImplementation(mockedGetComputedStyle);
    });

    afterEach(() => {
      getComputedStyleSpy.mockReset();
    });

    it('Returns the unprocessed value of a style property', () => {
      const result = element._getStyleProp('background');
      expect(result).toBe('#909');
    });

    it('Returns the numeric value of a style property in pixels', () => {
      const result = element._getStyleProp('height');
      expect(result).toBe(20);
    });
  });
});
