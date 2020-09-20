import TextAreaAutoSizeFactory from './TextAreaAutoSizeFactory.js';
let BaseClass;

describe('TextAreaAutoSizeFactory', () => {
  beforeEach(() => {
    BaseClass = class {};
  });

  test('Returns a class that extends BaseClass', () => {
    const ResultClass = TextAreaAutoSizeFactory(BaseClass);
    expect(ResultClass.prototype instanceof BaseClass).toBe(true);
  });
});
