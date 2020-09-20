import getCoercedAttr from './getCoercedAttr.js';
let element;

describe('getCoercedAttr', () => {
  beforeEach(() => {
    element = document.createElement('textarea');
    element.setAttribute('height', '20px');
    element.setAttribute('readonly', '');
  });

  test('Coerces attribute to a String', () => {
    const result = getCoercedAttr(element, 'height', String);
    expect(result).toBe('20px');
  });

  test('Coerces attribute to a String by default', () => {
    const result = getCoercedAttr(element, 'height');
    expect(result).toBe('20px');
  });

  test('Coerces attribute to a Number', () => {
    const result = getCoercedAttr(element, 'readonly', Number);
    expect(result).toBe(0);
  });

  test('Coerces attribute to a Boolean', () => {
    const result = getCoercedAttr(element, 'readonly', Boolean);
    expect(result).toBe(true);
  });

  test('Coerces attribute to a Boolean', () => {
    const result = getCoercedAttr(element, 'disabled', Boolean);
    expect(result).toBe(false);
  });
});
