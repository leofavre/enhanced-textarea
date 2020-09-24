import * as packages from './index.js';

let element;

describe('EnhancedTextAreaBuiltIn', () => {
  beforeEach(() => {
    element = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      hasAttribute: jest.fn(),
      getAttribute: jest.fn(),
      removeAttribute: jest.fn()
    };
  });

  it('Exports a default function', () => {
    expect(packages.default).toBeDefined;
  });

  it('Exports a enhance method', () => {
    expect(packages.enhance).toBeInstanceOf(Function);
  });

  describe('enhance', () => {
    it('Should work', () => {
      packages.enhance(element);
    });
  });
});
