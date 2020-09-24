import EnhancedTextAreaBuiltIn from './index.js';

describe('EnhancedTextAreaBuiltIn', () => {
  it('Extends HTMLTextAreaElement', () => {
    expect(EnhancedTextAreaBuiltIn.prototype)
      .toBeInstanceOf(HTMLTextAreaElement);
  });
});
