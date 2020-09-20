import TextAreaAutoSizeBuiltIn from './TextAreaAutoSizeBuiltIn.js';

describe('TextAreaAutoSizeBuiltIn', () => {
  test('Extends HTMLTextAreaElement', () => {
    expect(TextAreaAutoSizeBuiltIn.prototype instanceof HTMLTextAreaElement)
      .toBe(true);
  });
});
