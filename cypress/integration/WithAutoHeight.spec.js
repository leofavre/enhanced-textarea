import { LOREM, DELETE_ALL } from '../constants/index.js';

describe('WithAutoHeight', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  afterEach(() => {
    cy.wait(500);
  });

  it('Grows or shrinks according to text being typed or deleted', () => {
    cy.get('textarea')
      .type(LOREM)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 90, 98);

    cy.get('textarea')
      .wait(500)
      .type(DELETE_ALL)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 27, 35);
  });

  it('Grows or shrinks according to text being ' +
    'set or removed programmatically', () => {
    cy.get('textarea')
      .wait(500)
      .invoke('prop', 'value', LOREM)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 90, 98);

    cy.get('textarea')
      .wait(500)
      .invoke('prop', 'value', '')
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 27, 35);
  });

  it('Respects a minimum height when the rows attribute is set', () => {
    cy.get('textarea')
      .invoke('attr', 'rows', '2')
      .type(LOREM)
      .should('have.prop', 'clientHeight')
      .and('be.within', 90, 98);

    cy.get('textarea')
      .wait(500)
      .type(DELETE_ALL)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 48, 56);
  });

  it('Respects a minimum height when its style property is set', () => {
    cy.get('textarea')
      .invoke('css', 'height', '65px')
      .type(LOREM)
      .should('have.prop', 'clientHeight')
      .and('be.within', 90, 98);

    cy.get('textarea')
      .wait(500)
      .type(DELETE_ALL)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 71, 79);
  });

  it('Grows or shrinks according to style applied ' +
    'directly to the component', () => {
    cy.get('textarea')
      .invoke('prop', 'value', LOREM)
      .wait(500)
      .invoke('css', 'lineHeight', '2')
      .should('have.prop', 'clientHeight')
      .and('be.within', 134, 142);

    cy.get('textarea')
      .wait(500)
      .invoke('css', 'lineHeight', '3')
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 198, 206);

    cy.get('textarea')
      .wait(500)
      .invoke('css', 'lineHeight', '2')
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 134, 142);

    cy.get('textarea')
      .wait(500)
      .invoke('css', 'lineHeight', '')
      .should('have.prop', 'clientHeight')
      .and('be.within', 90, 98);
  });

  it('Grows or shrinks according to a class applied ' +
    'directly to the component', () => {
    cy.get('textarea')
      .invoke('prop', 'value', LOREM)
      .wait(500)
      .invoke('addClass', 'larger')
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 198, 206);

    cy.get('textarea')
      .wait(500)
      .invoke('removeClass', 'larger')
      .should('have.prop', 'clientHeight')
      .and('be.within', 90, 98);
  });

  it('Calculates height with or without box-sizing: border-box', () => {
    cy.get('textarea')
      .invoke('prop', 'value', LOREM)
      .wait(500)
      .invoke('css', 'padding', '40px')
      .invoke('css', 'borderWidth', '15px')
      .wait(500)
      .invoke('css', 'boxSizing', 'border-box')
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 202, 210);

    cy.get('textarea')
      .should('have.prop', 'clientWidth')
      .and('be.within', 316, 324);

    cy.get('textarea')
      .wait(500)
      .invoke('css', 'boxSizing', 'content-box')
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 160, 168);

    cy.get('textarea')
      .should('have.prop', 'clientWidth')
      .and('be.within', 426, 434);
  });

  it('Respects a minimum height when the user resizes the element', () => {
    cy.get('textarea')
      .invoke('prop', 'value', LOREM)
      .invoke('css', 'resize', 'both')
      .screenshot()
      .trigger('pointerdown', 'bottomRight')
      .wait(500)
      .invoke('css', 'width', '250px')
      .invoke('css', 'height', '50px')
      .trigger('pointerup')
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 132, 140);
  });
});
