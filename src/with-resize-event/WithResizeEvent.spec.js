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

  describe('.connectedCallback()', () => {
    beforeEach(() => {
      element._handleResizeEventStart = jest.fn();
    });

    it('Calls super.connectedCallback', () => {
      Base.prototype.connectedCallback = jest.fn();
      Element = WithResizeEvent(Base);
      element = new Element();
      element._handleResizeEventStart = jest.fn();

      element.connectedCallback();
      expect(Base.prototype.connectedCallback).toHaveBeenCalled;
    });

    it('Calls _handleResizeEventStart', () => {
      element.connectedCallback();
      expect(element._handleResizeEventStart).toHaveBeenCalled;
    });
  });

  describe('.disconnectedCallback()', () => {
    beforeEach(() => {
      element._handleResizeEventEnd = jest.fn();
    });

    it('Calls super.disconnectedCallback', () => {
      Base.prototype.disconnectedCallback = jest.fn();
      Element = WithResizeEvent(Base);
      element = new Element();
      element._handleResizeEventEnd = jest.fn();

      element.disconnectedCallback();
      expect(Base.prototype.disconnectedCallback).toHaveBeenCalled;
    });

    it('Calls _handleResizeEventEnd', () => {
      element.disconnectedCallback();
      expect(element._handleResizeEventEnd).toHaveBeenCalled;
    });
  });

  describe('._handleResizeEventStart()', () => {
    beforeEach(() => {
      element.addEventListener = jest.fn();
    });

    it('Observes user interaction', () => {
      element._handleResizeEventStart();

      expect(element.addEventListener)
        .toHaveBeenCalledWith('pointerup', element._handlePointer);

      expect(element.addEventListener)
        .toHaveBeenCalledWith('pointerdown', element._handlePointer);
    });
  });

  describe('._handleResizeEventEnd()', () => {
    beforeEach(() => {
      element.removeEventListener = jest.fn();
    });

    it('Observes user interaction', () => {
      element._handleResizeEventEnd();

      expect(element.removeEventListener)
        .toHaveBeenCalledWith('pointerup', element._handlePointer);

      expect(element.removeEventListener)
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

    it('Stores dimensions on pointerdown', () => {
      element.offsetHeight = 50;
      element.offsetWidth = 100;

      element._handlePointer({ type: 'pointerdown' });

      expect(element._preResizeHeight).toBe(50);
      expect(element._preResizeWidth).toBe(100);
    });

    it('Dispatches resize event if was resized', () => {
      element._preResizeHeight = 50;
      element._preResizeWidth = 100;

      element.offsetHeight = 55;
      element.offsetWidth = 105;

      element._handlePointer({ type: 'pointerup' });

      expect(CustomEventSpy).toHaveBeenCalledWith('resize', {
        bubbles: true,
        cancelable: false,
        composed: true
      });

      expect(element.dispatchEvent)
        .toHaveBeenCalledWith(CustomEventSpy.mock.instances[0]);
    });

    it('Does not dispatch resize event if was not resized', () => {
      element._preResizeHeight = 50;
      element._preResizeWidth = 100;

      element.offsetHeight = 50;
      element.offsetWidth = 100;

      element._handlePointer({ type: 'pointerup' });

      expect(CustomEventSpy).not.toHaveBeenCalled;
      expect(element.dispatchEvent).not.toHaveBeenCalled;
    });
  });
});
