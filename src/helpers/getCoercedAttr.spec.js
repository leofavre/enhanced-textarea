import getCoercedAttr from './getCoercedAttr.js';
import sinon from 'sinon';
let element;

describe('setAttr', () => {
  beforeEach(() => {
    const hasAttributeStub = sinon.stub();
    hasAttributeStub.withArgs('height').returns(true);
    hasAttributeStub.withArgs('readonly').returns(true);
    hasAttributeStub.withArgs('disabled').returns(false);

    const getAttributeStub = sinon.stub();
    getAttributeStub.withArgs('height').returns('20px');
    getAttributeStub.withArgs('readonly').returns('');
    getAttributeStub.withArgs('disabled').returns(null);

    element = {
      hasAttribute: hasAttributeStub,
      getAttribute: getAttributeStub
    };
  });

  test('Coerces attribute to a String', () => {
    const result = getCoercedAttr(element, 'height', String);
    expect(result).toBe('20px');
  });

  test('Coerces attribute to a String by default', () => {
    const result = getCoercedAttr(element, 'height');
    expect(result).toBe('20px');
  });

  test('Calls getAttribute if the attribute is coerced to a String', () => {
    getCoercedAttr(element, 'height', String);
    expect(element.getAttribute).toHaveBeenCalledOnceWith('height');
  });

  test('Coerces attribute to a Number', () => {
    const result = getCoercedAttr(element, 'readonly', Number);
    expect(result).toBe(0);
  });

  test('Calls getAttribute if the attribute is coerced to a Number', () => {
    getCoercedAttr(element, 'readonly', Number);
    expect(element.getAttribute).toHaveBeenCalledOnceWith('readonly');
  });

  test('Coerces attribute to a Boolean', () => {
    const result = getCoercedAttr(element, 'disabled', Boolean);
    expect(result).toBe(false);
  });

  test('Calls hasAttribute if the attribute is coerced to a Boolean', () => {
    getCoercedAttr(element, 'disabled', Boolean);
    expect(element.hasAttribute).toHaveBeenCalledOnceWith('disabled');
  });
});
