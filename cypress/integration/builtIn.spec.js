import { LOREM, DELETE_ALL } from '../constants/index.js';
import setAttr from '../helpers/setAttr.js';
import setProp from '../helpers/setProp.js';
import setStyleProp from '../helpers/setStyleProp.js';

describe('Built-in Element', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Grows when text is typed', () => {
    cy.get('textarea')
      .type(LOREM);
  });

  it('Shrinks when text is deleted', () => {
    cy.get('textarea')
      .type(LOREM)
      .type(DELETE_ALL);
  });

  it('Grows when text is set programmatically', () => {
    cy.get('textarea')
      .then(setProp('value', LOREM));
  });

  it('Shrinks when text is deleted programmatically', () => {
    cy.get('textarea')
      .then(setProp('value', LOREM))
      .then(setProp('value', ''));
  });

  it('Shrinks to a minimum height when the rows ' +
    'attribute is set and text is deleted', () => {
    cy.get('textarea')
      .then(setAttr('rows', 2))
      .then(setProp('value', LOREM))
      .type(DELETE_ALL);
  });

  it('Shrinks to a minimum height when the height ' +
    'style property is set and text is deleted', () => {
    cy.get('textarea')
      .then(setStyleProp('height', '35px'))
      .then(setProp('value', LOREM))
      .type(DELETE_ALL);
  });
});
