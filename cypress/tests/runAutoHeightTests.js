import { LOREM, DELETE_ALL, TYPE_OPTIONS } from '../constants/index.js';

const runAutoHeightTests = ({ selector, startFunction }) => {
  describe('Auto Height', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get(selector).as('textarea');
      cy.window().then(startFunction);
    });

    it('Grows or shrinks according to text being typed or deleted', () => {
      cy.get('@textarea')
        .type(LOREM, TYPE_OPTIONS)
        .should('have.prop', 'clientHeight')
        .and('be.within', 90, 98);

      cy.get('@textarea')
        .type(DELETE_ALL, TYPE_OPTIONS)
        .should('have.prop', 'clientHeight')
        .and('be.within', 27, 35);
    });

    it('Grows or shrinks according to text being ' +
      'set or removed programmatically', () => {
      cy.get('@textarea')
        .invoke('prop', 'value', LOREM)
        .should('have.prop', 'clientHeight')
        .and('be.within', 90, 98);

      cy.get('@textarea')
        .invoke('prop', 'value', '')
        .should('have.prop', 'clientHeight')
        .and('be.within', 27, 35);
    });

    it('Respects a minimum height when the rows attribute is set', () => {
      cy.get('@textarea')
        .invoke('attr', 'rows', '2')
        .type(LOREM, TYPE_OPTIONS)
        .should('have.prop', 'clientHeight')
        .and('be.within', 90, 98);

      cy.get('@textarea')
        .type(DELETE_ALL, TYPE_OPTIONS)
        .should('have.prop', 'clientHeight')
        .and('be.within', 48, 56);
    });

    it('Respects a minimum height when the height ' +
      'style property is set', () => {
      cy.get('@textarea')
        .invoke('css', 'height', '65px')
        .type(LOREM, TYPE_OPTIONS)
        .should('have.prop', 'clientHeight')
        .and('be.within', 90, 98);

      cy.get('@textarea')
        .type(DELETE_ALL, TYPE_OPTIONS)
        .should('have.prop', 'clientHeight')
        .and('be.within', 71, 79);
    });

    it('Grows or shrinks according to style applied ' +
      'directly to the component', () => {
      cy.get('@textarea')
        .invoke('prop', 'value', LOREM)
        .invoke('css', 'lineHeight', '3')
        .should('have.prop', 'clientHeight')
        .and('be.within', 198, 206);

      cy.get('@textarea')
        .invoke('css', 'lineHeight', '2')
        .should('have.prop', 'clientHeight')
        .and('be.within', 134, 142);

      cy.get('@textarea')
        .invoke('css', 'lineHeight', '')
        .should('have.prop', 'clientHeight')
        .and('be.within', 90, 98);
    });

    it('Grows or shrinks according to a class applied ' +
      'directly to the component', () => {
      cy.get('@textarea')
        .invoke('prop', 'value', LOREM)
        .invoke('addClass', 'larger')
        .should('have.prop', 'clientHeight')
        .and('be.within', 134, 142);

      cy.get('@textarea')
        .invoke('removeClass', 'larger')
        .should('have.prop', 'clientHeight')
        .and('be.within', 90, 98);
    });

    it('Calculates height with or without box-sizing: border-box', () => {
      cy.get('@textarea')
        .invoke('prop', 'value', LOREM)
        .invoke('css', 'padding', '40px')
        .invoke('css', 'borderWidth', '15px')
        .invoke('css', 'boxSizing', 'border-box')
        .should('have.prop', 'clientHeight')
        .and('be.within', 160, 168);

      cy.get('@textarea')
        .should('have.prop', 'clientWidth')
        .and('be.within', 316, 324);

      cy.get('@textarea')
        .invoke('css', 'boxSizing', 'content-box')
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
        .trigger('pointerdown', 'bottomRight')
        .invoke('css', 'width', '250px')
        .invoke('css', 'height', '50px')
        .trigger('pointerup')
        .should('have.prop', 'clientHeight')
        .and('be.within', 90, 98);
    });

    it('Toggles the autoheight behaviour when the attribute is toggled', () => {
      cy.get('@textarea')
        .invoke('attr', 'autoheight', '')
        .type(LOREM.slice(0, LOREM.length / 2), TYPE_OPTIONS)
        .should('have.prop', 'clientHeight')
        .and('be.within', 48, 56);

      cy.get('@textarea')
        .invoke('attr', 'autoheight', null)
        .type(LOREM.slice(LOREM.length / 2), TYPE_OPTIONS)
        .should('have.prop', 'clientHeight')
        .and('be.within', 48, 56);

      cy.get('@textarea')
        .invoke('attr', 'autoheight', '')
        .should('have.prop', 'clientHeight')
        .and('be.within', 90, 98);
    });

    it('Toggles the autoheight behaviour when the property is toggled', () => {
      cy.get('@textarea')
        .invoke('prop', 'autoheight', true)
        .type(LOREM.slice(0, LOREM.length / 2), TYPE_OPTIONS)
        .should('have.prop', 'clientHeight')
        .and('be.within', 48, 56);

      cy.get('@textarea')
        .invoke('prop', 'autoheight', false)
        .type(LOREM.slice(LOREM.length / 2), TYPE_OPTIONS)
        .should('have.prop', 'clientHeight')
        .and('be.within', 48, 56);

      cy.get('@textarea')
        .invoke('prop', 'autoheight', true)
        .should('have.prop', 'clientHeight')
        .and('be.within', 90, 98);
    });
  });
};

export default runAutoHeightTests;
