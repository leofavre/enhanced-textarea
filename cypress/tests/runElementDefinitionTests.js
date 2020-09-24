import { LOREM } from '../constants';

const runElementDefinitionTests = ({ selector, startFunction }) => {
  describe('Element Definition', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get(selector).as('textarea');
    });

    it('Lazily sets the autoheight property', () => {
      cy.get('@textarea')
        .invoke('attr', 'autoheight', null)
        .invoke('prop', 'autoheight', true)
        .invoke('prop', 'value', LOREM)
        .should('have.prop', 'clientHeight')
        .and('be.within', 27, 35);

      cy.window().then(startFunction);

      cy.get('@textarea')
        .should('have.prop', 'clientHeight')
        .and('be.within', 90, 98);
    });

    it('Lazily sets the autoheight attribute', () => {
      cy.get('@textarea')
        .invoke('attr', 'autoheight', '')
        .invoke('prop', 'autoheight', undefined)
        .invoke('prop', 'value', LOREM)
        .should('have.prop', 'clientHeight')
        .and('be.within', 27, 35);

      cy.window().then(startFunction);

      cy.get('@textarea')
        .should('have.prop', 'clientHeight')
        .and('be.within', 90, 98);
    });

    it('Reflects the autoheight property to an attribute', () => {
      cy.window().then(startFunction);

      cy.get('@textarea')
        .invoke('prop', 'autoheight', true);

      cy.get('@textarea')
        .should('have.prop', 'autoheight')
        .and('equal', true);

      cy.get('@textarea')
        .should('have.attr', 'autoheight')
        .and('equal', '');
    });

    it('Reflects the autoheight attribute to a property', () => {
      cy.window().then(startFunction);

      cy.get('@textarea')
        .invoke('attr', 'autoheight', '');

      cy.get('@textarea')
        .should('have.prop', 'autoheight')
        .and('equal', true);

      cy.get('@textarea')
        .should('have.attr', 'autoheight')
        .and('equal', '');
    });
  });
};

export default runElementDefinitionTests;
