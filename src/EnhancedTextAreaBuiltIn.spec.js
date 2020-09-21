import EnhancedTextAreaBuiltIn from './EnhancedTextAreaBuiltIn.js';

describe('EnhancedTextAreaBuiltIn', () => {
  test('Extends HTMLTextAreaElement', () => {
    expect(EnhancedTextAreaBuiltIn.prototype)
      .toBeInstanceOf(HTMLTextAreaElement);
  });
});
