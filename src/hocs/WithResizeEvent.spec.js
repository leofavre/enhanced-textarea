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

  describe('.baseElement', () => {
    it('Returns the instance', () => {
      expect(element.baseElement).toBe(element);
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

      expect(element.baseElement.addEventListener)
        .toHaveBeenCalledWith('pointerup', element._handlePointer);

      expect(element.baseElement.addEventListener)
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

      expect(element.baseElement.removeEventListener)
        .toHaveBeenCalledWith('pointerup', element._handlePointer);

      expect(element.baseElement.removeEventListener)
        .toHaveBeenCalledWith('pointerdown', element._handlePointer);
    });
  });

  describe('._handlePointer()', () => {
    let CustomEventSpy;

    beforeEach(() => {
      CustomEventSpy = jest.spyOn(global, 'CustomEvent');
      element.baseElement.dispatchEvent = jest.fn();
    });

    afterEach(() => {
      CustomEventSpy.mockReset();
    });

    it('Does nothing if type is undefined', () => {
      element._handlePointer();
    });

    it('Stores baseElement dimensions on pointerdown', () => {
      element.baseElement.offsetHeight = 50;
      element.baseElement.offsetWidth = 100;

      element._handlePointer({ type: 'pointerdown' });

      expect(element._preResizeHeight).toBe(50);
      expect(element._preResizeWidth).toBe(100);
    });

    it('Dispatches userresize event if baseElement was resized', () => {
      element._preResizeHeight = 50;
      element._preResizeWidth = 100;

      element.baseElement.offsetHeight = 55;
      element.baseElement.offsetWidth = 105;

      element._handlePointer({ type: 'pointerup' });

      expect(CustomEventSpy).toHaveBeenCalledWith('userresize', {
        bubbles: true,
        cancelable: false,
        composed: true
      });

      expect(element.baseElement.dispatchEvent)
        .toHaveBeenCalledWith(CustomEventSpy.mock.instances[0]);
    });

    it('Does not dispatch userresize event if baseElement ' +
      'was not resized', () => {
      element._preResizeHeight = 50;
      element._preResizeWidth = 100;

      element.baseElement.offsetHeight = 50;
      element.baseElement.offsetWidth = 100;

      element._handlePointer({ type: 'pointerup' });

      expect(CustomEventSpy).not.toHaveBeenCalled;
      expect(element.baseElement.dispatchEvent).not.toHaveBeenCalled;
    });
  });
});
