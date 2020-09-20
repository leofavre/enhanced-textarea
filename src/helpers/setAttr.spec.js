import setAttr from './setAttr.js';
let element;

describe('setAttr', () => {
  beforeEach(() => {
    element = document.createElement('textarea');
  });

  test('Sets an attribute to the unprocessed value if it is a number', () => {
    setAttr(element, 'height', 20);
    expect(element.getAttribute('height')).toBe('20');
  });

  test('Sets an attribute to the unprocessed value if it is zero', () => {
    setAttr(element, 'height', 0);
    expect(element.getAttribute('height')).toBe('0');
  });

  test('Sets an attribute to the unprocessed value if it is a string', () => {
    setAttr(element, 'height', '20px');
    expect(element.getAttribute('height')).toBe('20px');
  });

  test('Sets an attribute to an empty string if the value is true', () => {
    setAttr(element, 'height', true);
    expect(element.getAttribute('height')).toBe('');
  });

  test('Removes an attribute if the value is null', () => {
    setAttr(element, 'height', null);
    expect(element.getAttribute('height')).toBe(null);
  });

  test('Removes an attribute if the value is undefined', () => {
    setAttr(element, 'height');
    expect(element.getAttribute('height')).toBe(null);
  });

  test('Removes an attribute if the value is false', () => {
    setAttr(element, 'height', false);
    expect(element.getAttribute('height')).toBe(null);
  });
});
