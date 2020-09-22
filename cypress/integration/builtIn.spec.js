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

  it('Respects a minimum height when the rows attribute is set', () => {
    cy.get('textarea')
      .then(setAttr('rows', 2))
      .type(LOREM)
      .type(DELETE_ALL);
  });

  it('Respects a minimum height when its style property is set', () => {
    cy.get('textarea')
      .then(setStyleProp('height', '65px'))
      .type(LOREM)
      .type(DELETE_ALL);
  });
});
