import getCoercedAttr from './getCoercedAttr.js';
let element;

describe('setAttr', () => {
  beforeEach(() => {
    element = {
      hasAttribute: jest.fn(),
      getAttribute: jest.fn()
    };
  });

  test('Calls getAttribute if the attribute is coerced to a String ' +
    'by default', () => {
    getCoercedAttr(element, 'height');
    expect(element.getAttribute).toHaveBeenCalledWith('height');
  });

  test('Calls getAttribute if the attribute is coerced to a String', () => {
    getCoercedAttr(element, 'height', String);
    expect(element.getAttribute).toHaveBeenCalledWith('height');
  });

  test('Calls getAttribute if the attribute is coerced to a Number', () => {
    getCoercedAttr(element, 'readonly', Number);
    expect(element.getAttribute).toHaveBeenCalledWith('readonly');
  });

  test('Calls hasAttribute if the attribute is coerced to a Boolean', () => {
    getCoercedAttr(element, 'disabled', Boolean);
    expect(element.hasAttribute).toHaveBeenCalledWith('disabled');
  });
});
