import * as packages from './built-in.js';

describe('EnhancedTextAreaBuiltIn', () => {
  it('Exports a default function', () => {
    expect(packages.default).toBeDefined;
  });

  it('Exports a defineElement method', () => {
    expect(packages.defineElement).toBeInstanceOf(Function);
  });

  describe('defineElement', () => {
    let customElementsDefineSpy;

    beforeEach(() => {
      customElementsDefineSpy = jest.spyOn(global.customElements, 'define');
    });

    it('Defines a custom element with the default name', () => {
      packages.defineElement();

      expect(customElementsDefineSpy).toHaveBeenCalledWith(
        'enhanced-textarea',
        packages.default,
        { extends: 'textarea' }
      );
    });

    it('Defines a custom element with a custom name', () => {
      packages.defineElement('custom-name');

      expect(customElementsDefineSpy).toHaveBeenCalledWith(
        'custom-name',
        packages.default,
        { extends: 'textarea' }
      );
    });
  });
});
