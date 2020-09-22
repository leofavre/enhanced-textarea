import WithResizeEvent from './WithResizeEvent.js';

let Base;
let Element;
let element;

describe('WithResizeEvent', () => {
  beforeEach(() => {
    Base = class {};
    Element = WithResizeEvent(Base);
    element = new Element();
  });

  it('Uses an empty class as default parameter', () => {
    WithResizeEvent();
  });

  it('Returns a class that extends another passed as parameter', () => {
    expect(Element.prototype).toBeInstanceOf(Base);
  });

  describe('.constructor()', () => {
    it('Makes sure _handlePointer always is bound to the instance', () => {
      Element.prototype._handlePointer = function () { return this; };
      element = new Element();
      const [result] = [1].map(element._handlePointer);
      expect(result).toBe(element);
    });
  });

  describe('.textElement', () => {
    it('Returns the instance', () => {
      expect(element.textElement).toBe(element);
    });
  });

  describe('.connectedCallback()', () => {
    beforeEach(() => {
      element.addEventListener = jest.fn();
    });

    it('Calls super.connectedCallback', () => {
      Base.prototype.connectedCallback = jest.fn();
      Element = WithResizeEvent(Base);
      element = new Element();
      element.addEventListener = jest.fn();
      element.connectedCallback();
      expect(Base.prototype.connectedCallback).toHaveBeenCalled;
    });

    it('Observes user interaction', () => {
      element.connectedCallback();

      expect(element.textElement.addEventListener)
        .toHaveBeenCalledWith('pointerup', element._handlePointer);

      expect(element.textElement.addEventListener)
        .toHaveBeenCalledWith('pointerdown', element._handlePointer);
    });
  });

  describe('.disconnectedCallback()', () => {
    beforeEach(() => {
      element.removeEventListener = jest.fn();
    });

    it('Calls super.disconnectedCallback', () => {
      Base.prototype.disconnectedCallback = jest.fn();
      Element = WithResizeEvent(Base);
      element = new Element();
      element.removeEventListener = jest.fn();
      element.disconnectedCallback();
      expect(Base.prototype.disconnectedCallback).toHaveBeenCalled;
    });

    it('Observes user interaction', () => {
      element.disconnectedCallback();

      expect(element.textElement.removeEventListener)
        .toHaveBeenCalledWith('pointerup', element._handlePointer);

      expect(element.textElement.removeEventListener)
        .toHaveBeenCalledWith('pointerdown', element._handlePointer);
    });
  });

  describe('._handlePointer()', () => {
    let CustomEventSpy;

    beforeEach(() => {
      CustomEventSpy = jest.spyOn(global, 'CustomEvent');
      element.dispatchEvent = jest.fn();
    });

    afterEach(() => {
      CustomEventSpy.mockReset();
    });

    it('Does nothing if type is undefined', () => {
      element._handlePointer();
    });

    it('Stores textElement dimensions on pointerdown', () => {
      element.textElement.offsetHeight = 50;
      element.textElement.offsetWidth = 100;

      element._handlePointer({ type: 'pointerdown' });

      expect(element._preResizeHeight).toBe(50);
      expect(element._preResizeWidth).toBe(100);
    });

    it('Dispatches userresize event if textElement was resized', () => {
      element._preResizeHeight = 50;
      element._preResizeWidth = 100;

      element.textElement.offsetHeight = 55;
      element.textElement.offsetWidth = 105;

      element._handlePointer({ type: 'pointerup' });

      expect(CustomEventSpy).toHaveBeenCalledWith('userresize', {
        bubbles: true,
        cancelable: false,
        composed: true
      });

      expect(element.dispatchEvent)
        .toHaveBeenCalledWith(CustomEventSpy.mock.instances[0]);
    });

    it('Does not dispatch userresize event if textElement ' +
      'was not resized', () => {
      element._preResizeHeight = 50;
      element._preResizeWidth = 100;

      element.textElement.offsetHeight = 50;
      element.textElement.offsetWidth = 100;

      element._handlePointer({ type: 'pointerup' });

      expect(CustomEventSpy).not.toHaveBeenCalled;
      expect(element.dispatchEvent).not.toHaveBeenCalled;
    });
  });
});
