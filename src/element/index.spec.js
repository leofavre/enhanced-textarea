import * as packages from './index.js';

describe('EnhancedTextAreaElement', () => {
  it('Exports a default function', () => {
    expect(packages.default).toBeDefined;
  });

  it('Exports a defineElement method', () => {
    expect(packages.defineElement).toBeInstanceOf(Function);
  });

  describe('defineElement', () => {
    let customElementsDefineSpy;

    beforeEach(() => {
      customElementsDefineSpy = jest.spyOn(customElements, 'define');
    });

    it('Defines a custom element with the default name', () => {
      packages.defineElement();

      expect(customElementsDefineSpy).toHaveBeenCalledWith(
        'enhanced-textarea',
        packages.default
      );
    });

    it('Defines a custom element with a custom name', () => {
      packages.defineElement('custom-name');

      expect(customElementsDefineSpy).toHaveBeenCalledWith(
        'custom-name',
        packages.default
      );
    });
  });
});
