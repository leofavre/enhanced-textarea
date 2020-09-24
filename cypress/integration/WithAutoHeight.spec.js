import { LOREM, DELETE_ALL } from '../constants/index.js';

describe('WithAutoHeight', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('textarea').as('textarea');
    // cy.window().then(win => win.defineEnhancedTextAreaBuiltIn());
  });

  afterEach(() => {
    cy.wait(500);
  });

  it('Grows or shrinks according to text being typed or deleted', () => {
    cy.get('@textarea')
      .type(LOREM)
      .wait(500)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 90, 98);

    cy.get('@textarea')
      .type(DELETE_ALL)
      .wait(500)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 27, 35);
  });

  it('Grows or shrinks according to text being ' +
    'set or removed programmatically', () => {
    cy.get('@textarea')
      .invoke('prop', 'value', LOREM)
      .wait(500)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 90, 98);

    cy.get('@textarea')
      .invoke('prop', 'value', '')
      .wait(500)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 27, 35);
  });

  it('Respects a minimum height when the rows attribute is set', () => {
    cy.get('@textarea')
      .invoke('attr', 'rows', '2')
      .type(LOREM)
      .should('have.prop', 'clientHeight')
      .and('be.within', 90, 98);

    cy.get('@textarea')
      .type(DELETE_ALL)
      .wait(500)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 48, 56);
  });

  it('Respects a minimum height when the height style property is set', () => {
    cy.get('@textarea')
      .invoke('css', 'height', '65px')
      .type(LOREM)
      .should('have.prop', 'clientHeight')
      .and('be.within', 90, 98);

    cy.get('@textarea')
      .type(DELETE_ALL)
      .wait(500)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 71, 79);
  });

  it('Grows or shrinks according to style applied ' +
    'directly to the component', () => {
    cy.get('@textarea')
      .invoke('prop', 'value', LOREM)
      .invoke('css', 'lineHeight', '3')
      .wait(500)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 198, 206);

    cy.get('@textarea')
      .invoke('css', 'lineHeight', '2')
      .wait(500)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 134, 142);

    cy.get('@textarea')
      .invoke('css', 'lineHeight', '')
      .wait(500)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 90, 98);
  });

  it('Grows or shrinks according to a class applied ' +
    'directly to the component', () => {
    cy.get('@textarea')
      .invoke('prop', 'value', LOREM)
      .invoke('addClass', 'larger')
      .wait(500)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 198, 206);

    cy.get('@textarea')
      .invoke('removeClass', 'larger')
      .wait(500)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 90, 98);
  });

  it('Calculates height with or without box-sizing: border-box', () => {
    cy.get('@textarea')
      .invoke('prop', 'value', LOREM)
      .invoke('css', 'padding', '40px')
      .invoke('css', 'borderWidth', '15px')
      .invoke('css', 'boxSizing', 'border-box')
      .wait(500)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 202, 210);

    cy.get('@textarea')
      .should('have.prop', 'clientWidth')
      .and('be.within', 316, 324);

    cy.get('@textarea')
      .invoke('css', 'boxSizing', 'content-box')
      .wait(500)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 160, 168);

    cy.get('@textarea')
      .should('have.prop', 'clientWidth')
      .and('be.within', 426, 434);
  });

  it('Respects a minimum height when the user resizes the element', () => {
    cy.get('@textarea')
      .invoke('prop', 'value', LOREM)
      .invoke('css', 'resize', 'both')
      .wait(500)
      .screenshot()
      .trigger('pointerdown', 'bottomRight')
      .invoke('css', 'width', '250px')
      .invoke('css', 'height', '50px')
      .trigger('pointerup')
      .wait(500)
      .screenshot()
      .should('have.prop', 'clientHeight')
      .and('be.within', 132, 140);
  });
});
