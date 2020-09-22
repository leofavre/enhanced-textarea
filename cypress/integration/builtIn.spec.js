import { LOREM, DELETE_ALL } from '../constants/index.js';

describe('Built-in Element', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  afterEach(() => {
    cy.wait(500);
  });

  it('Grows when text is typed and shrinks when text is deleted', () => {
    cy.get('textarea')
      .type(LOREM)
      .wait(500)
      .type(DELETE_ALL);
  });

  it('Grows when text is set programmatically and shrinks when ' +
    'text is deleted programmatically', () => {
    cy.get('textarea')
      .wait(500)
      .invoke('prop', 'value', LOREM)
      .wait(500)
      .invoke('prop', 'value', '');
  });

  it('Respects a minimum height when the rows attribute is set', () => {
    cy.get('textarea')
      .invoke('attr', 'rows', '2')
      .type(LOREM)
      .wait(500)
      .type(DELETE_ALL);
  });

  it('Respects a minimum height when its style property is set', () => {
    cy.get('textarea')
      .invoke('css', 'height', '65px')
      .type(LOREM)
      .wait(500)
      .type(DELETE_ALL);
  });

  it('Grows when a style change causes text to grow and shrinks ' +
    'when a style change causes text to shrink', () => {
    cy.get('textarea')
      .invoke('prop', 'value', LOREM)
      .wait(500)
      .invoke('css', 'lineHeight', '2')
      .wait(500)
      .invoke('css', 'lineHeight', '3')
      .wait(500)
      .invoke('css', 'lineHeight', '2')
      .wait(500)
      .invoke('css', 'lineHeight', '1');
  });
});
