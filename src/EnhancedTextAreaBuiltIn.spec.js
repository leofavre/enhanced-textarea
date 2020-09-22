import EnhancedTextAreaBuiltIn from './EnhancedTextAreaBuiltIn.js';

describe('EnhancedTextAreaBuiltIn', () => {
  it('Extends HTMLTextAreaElement', () => {
    expect(EnhancedTextAreaBuiltIn.prototype)
      .toBeInstanceOf(HTMLTextAreaElement);
  });
});
