import WithResizeEvent, { WithResizeEventBase, WithResizeEventDecorator, HTMLTextAreaElementWithResizeEvent } from './WithResizeEvent';
import { Mutable } from '../types';

type MockedElement = Mutable<HTMLTextAreaElementWithResizeEvent & {
  _preResizeHeight: number;
  _preResizeWidth: number;
  _handleResizeEventStart(): void;
  _handleResizeEventEnd(): void;
  _handlePointer(evt?: Record<string, string>): void;
}>;

let Base: WithResizeEventBase;
let Element: WithResizeEventDecorator;
let element: MockedElement;

describe('WithResizeEvent', () => {
  beforeEach(() => {
    Base = class {} as unknown as WithResizeEventBase;
    Element = WithResizeEvent(Base);
    element = new Element() as unknown as MockedElement;
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
      element = new Element() as unknown as MockedElement;
      element._handleResizeEventStart = jest.fn();

      element.connectedCallback();
      expect(Base.prototype.connectedCallback).toHaveBeenCalled();
    });

    it('Calls _handleResizeEventStart', () => {
      element.connectedCallback();
      expect(element._handleResizeEventStart).toHaveBeenCalled();
    });
  });

  describe('.disconnectedCallback()', () => {
    beforeEach(() => {
      element._handleResizeEventEnd = jest.fn();
    });

    it('Calls super.disconnectedCallback', () => {
      Base.prototype.disconnectedCallback = jest.fn();
      Element = WithResizeEvent(Base);
      element = new Element() as unknown as MockedElement;
      element._handleResizeEventEnd = jest.fn();

      element.disconnectedCallback();
      expect(Base.prototype.disconnectedCallback).toHaveBeenCalled();
    });

    it('Calls _handleResizeEventEnd', () => {
      element.disconnectedCallback();
      expect(element._handleResizeEventEnd).toHaveBeenCalled();
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
    let CustomEventSpy: jest.SpyInstance;

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

      expect(CustomEventSpy).not.toHaveBeenCalled();
      expect(element.dispatchEvent).not.toHaveBeenCalled();
    });
  });
});
