import getCoercedAttr from './getCoercedAttr';
let element;

describe('setAttr', () => {
  beforeEach(() => {
    element = {
      hasAttribute: jest.fn(() => true),
      getAttribute: jest.fn(() => '125')
    };
  });

  it('Calls getAttribute if the attribute is coerced to a String', () => {
    getCoercedAttr(element, 'height', String);
    expect(element.getAttribute).toHaveBeenCalledWith('height');
  });

  it('Returns a string if coerced to a String', () => {
    const result = getCoercedAttr(element, 'height', String);
    expect(result).toBe('125');
  });

  it('Calls getAttribute if the attribute is coerced to a Number', () => {
    getCoercedAttr(element, 'readonly', Number);
    expect(element.getAttribute).toHaveBeenCalledWith('readonly');
  });

  it('Returns a number if coerced to a Number', () => {
    const result = getCoercedAttr(element, 'height', Number);
    expect(result).toBe(125);
  });

  it('Calls hasAttribute if the attribute is coerced to a Boolean', () => {
    getCoercedAttr(element, 'disabled', Boolean);
    expect(element.hasAttribute).toHaveBeenCalledWith('disabled');
  });

  it('Returns a boolean if coerced to a Boolean', () => {
    const result = getCoercedAttr(element, 'disabled', Boolean);
    expect(result).toBe(true);
  });
});
