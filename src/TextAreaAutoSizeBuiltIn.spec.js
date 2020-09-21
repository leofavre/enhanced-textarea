import TextAreaAutoSizeBuiltIn from './TextAreaAutoSizeBuiltIn.js';

describe('TextAreaAutoSizeBuiltIn', () => {
  test('Extends HTMLTextAreaElement', () => {
    expect(TextAreaAutoSizeBuiltIn.prototype)
      .toBeInstanceOf(window.HTMLTextAreaElement);
  });
});
