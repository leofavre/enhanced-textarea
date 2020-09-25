import WithAutoHeight from './WithAutoHeight.js';

let Base;
let Element;
let element;

describe('WithAutoHeight', () => {
  beforeEach(() => {
    Base = class {};
    Element = WithAutoHeight(Base);
    element = new Element();
  });

  it('Uses an empty class as default parameter', () => {
    WithAutoHeight();
  });

  it('Returns a class that extends another passed as parameter', () => {
    expect(Element.prototype).toBeInstanceOf(Base);
  });

  describe('.baseElement', () => {
    it('Returns the instance', () => {
      expect(element.baseElement).toBe(element);
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

      expect(Element.observedAttributes.sort()).toEqual(expectedAttrs.sort());
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
      };

      Element = WithAutoHeight(Base);
      element = new Element();

      expect(Element.observedAttributes.sort()).toEqual(expectedAttrs.sort());
    });
  });

  describe('._handleAttributeChange', () => {
    beforeEach(() => {
      element.baseElement.hasAttribute = jest.fn();
    });

    it('Does nothing when attribute stays the same', () => {
      element._handleAutoHeightStart = jest.fn();
      element._handleAutoHeightEnd = jest.fn();
      element._handleChange = jest.fn();
      element._handleAttributeChange('rows', null, null);
      expect(element._handleAutoHeightStart).not.toHaveBeenCalled;
      expect(element._handleAutoHeightEnd).not.toHaveBeenCalled;
      expect(element._handleChange).not.toHaveBeenCalled;
    });

    it('Calls _handleAutoHeightStart when autoheight is set', () => {
      element._handleAutoHeightStart = jest.fn();
      element._handleAttributeChange('autoheight', null, '');
      expect(element._handleAutoHeightStart).toHaveBeenCalled;
    });

    it('Calls _handleAutoHeightEnd when autoheight is unset', () => {
      element._handleAutoHeightEnd = jest.fn();
      element._handleAttributeChange('autoheight', '', null);
      expect(element._handleAutoHeightEnd).toHaveBeenCalled;
    });

    it('Does not call _handleAutoHeightStart or _handleAutoHeightEnd ' +
      'when autoheight changes but is not set or unset', () => {
      element._handleAutoHeightStart = jest.fn();
      element._handleAutoHeightEnd = jest.fn();
      element._handleAttributeChange('autoheight', '', 'autoheight');
      expect(element._handleAutoHeightStart).not.toHaveBeenCalled;
      expect(element._handleAutoHeightEnd).not.toHaveBeenCalled;
    });

    it('Calls _handleChange when any attribute but style changes', () => {
      element._handleChange = jest.fn();
      element._handleAttributeChange('rows', '4', '2');
      expect(element._handleChange).toHaveBeenCalled;
    });

    it('Calls _handleChange when style properties ' +
      'except height or min-height change', () => {
      element._handleChange = jest.fn();
      const prevStyle = 'width: 100px;';
      const nextStyle = 'width: 150px;';
      element._handleAttributeChange('style', prevStyle, nextStyle);
      expect(element._handleChange).toHaveBeenCalled;
    });

    it('Does not call _handleChange when only style properties ' +
      'height or min-height change', () => {
      element._handleChange = jest.fn();
      const prevStyle = 'height: 100px; min-height: 100px;';
      const nextStyle = 'height: 150px;';
      element._handleAttributeChange('style', prevStyle, nextStyle);
      expect(element._handleChange).not.toHaveBeenCalled;
    });
  });

  describe('._handleAutoHeightStart()', () => {
    let ResizeObserverSpy;

    beforeEach(() => {
      ResizeObserverSpy = jest.spyOn(ResizeObserver.prototype, 'observe');
      element.baseElement.addEventListener = jest.fn();
    });

    afterEach(() => {
      ResizeObserverSpy.mockReset();
    });

    it('Observes baseElement user resize', () => {
      element._handleAutoHeightStart();

      expect(element._resizeObserver.observe)
        .toHaveBeenCalledWith(element.baseElement);
    });

    it('Observes user interaction', () => {
      element._handleAutoHeightStart();

      expect(element.baseElement.addEventListener)
        .toHaveBeenCalledWith('input', element._handleChange);

      expect(element.baseElement.addEventListener)
        .toHaveBeenCalledWith('userresize', element._handleResize);
    });
  });

  describe('._handleAutoHeightEnd()', () => {
    let ResizeObserverSpy;

    beforeEach(() => {
      ResizeObserverSpy = jest.spyOn(ResizeObserver.prototype, 'unobserve');
      element._resizeObserver = new ResizeObserver();
      element.baseElement.removeEventListener = jest.fn();
    });

    afterEach(() => {
      ResizeObserverSpy.mockReset();
    });

    it('Stops observing baseElement userresize', () => {
      element._handleAutoHeightEnd();

      expect(element._resizeObserver.unobserve)
        .toHaveBeenCalledWith(element.baseElement);
    });

    it('Stops observing user interaction', () => {
      element._handleAutoHeightEnd();

      expect(element.baseElement.removeEventListener)
        .toHaveBeenCalledWith('input', element._handleChange);

      expect(element.baseElement.removeEventListener)
        .toHaveBeenCalledWith('userresize', element._handleResize);
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
      element.baseElement.hasAttribute = () => false;
      element._handleChange();
    });

    it('Resizes baseElement considering padding and border ' +
      'if the box-sizing is not border-box', () => {
      element.baseElement.hasAttribute = () => true;

      element.baseElement.offsetHeight = 152;
      element.baseElement.clientHeight = 150;
      element.baseElement.scrollHeight = 195;
      element.baseElement.style = { height: 'auto' };

      element._getStyleProp = jest.fn(str => {
        if (str === 'box-sizing') return 'content-box';
        if (str.startsWith('padding')) return 20;
        if (str.startsWith('border')) return 10;
      });

      element._handleChange();

      expect(element.baseElement.style.minHeight).toBe('137px');
      expect(element.baseElement.style.height).toBe('auto');
    });

    it('Resizes baseElement ignoring padding and border ' +
      'if the box-sizing is border-box', () => {
      element.baseElement.hasAttribute = () => true;

      element.baseElement.offsetHeight = 152;
      element.baseElement.clientHeight = 150;
      element.baseElement.scrollHeight = 195;
      element.baseElement.style = { height: 'auto' };

      element._getStyleProp = jest.fn(str => {
        if (str === 'box-sizing') return 'border-box';
      });

      element._handleChange();

      expect(element.baseElement.style.minHeight).toBe('197px');
      expect(element.baseElement.style.height).toBe('auto');
    });

    it('Resizes baseElement when height is changed programmatically', () => {
      element.baseElement.hasAttribute = () => true;

      element.baseElement.offsetHeight = 152;
      element.baseElement.clientHeight = 150;
      element.baseElement.scrollHeight = 195;
      element.baseElement.style = { height: '90px' };

      element._getStyleProp = jest.fn(str => {
        if (str === 'box-sizing') return 'border-box';
      });

      element._handleChange();

      expect(element.baseElement.style.minHeight).toBe('197px');
      expect(element.baseElement.style.height).toBe('90px');
    });

    it('Resizes baseElement when height is changed by user interaction ' +
      'but restricts it to min-height', () => {
      element.baseElement.hasAttribute = () => true;
      element._resizedByUser = true;

      element.baseElement.offsetHeight = 152;
      element.baseElement.clientHeight = 150;
      element.baseElement.scrollHeight = 195;
      element.baseElement.style = { height: '90px' };

      element._getStyleProp = jest.fn(str => {
        if (str === 'box-sizing') return 'border-box';
      });

      element._handleChange();

      expect(element.baseElement.style.minHeight).toBe('197px');
      expect(element.baseElement.style.height).toBe('197px');
    });
  });

  describe('._handleResize()', () => {
    it('Class _handleChange after setting _resizedByUser to true ' +
      'and then sets _resizedByUser to false', () => {
      element._handleChange = jest.fn(function () {
        expect(element._resizedByUser).toBe(true);
      });

      element._handleResize();

      expect(element._handleChange).toHaveBeenCalled;
      expect(element._resizedByUser).toBe(false);
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
