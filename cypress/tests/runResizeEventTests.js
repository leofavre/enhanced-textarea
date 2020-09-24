const runResizeEventTests = ({ selector, startFunction }) => {
  describe('Resize Event', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get(selector).as('textarea');
      cy.window().then(startFunction);
    });

    it('Dispatches the userresize event', () => {
      const handleUserResize = ({ target }) => {
        target.setAttribute('resized', '');
      };

      cy.get('@textarea')
        .invoke('on', 'userresize', handleUserResize)
        .invoke('css', 'resize', 'both')
        .trigger('pointerdown', 'bottomRight')
        .invoke('css', 'height', '65px')
        .trigger('pointerup')
        .should('have.attr', 'resized');
    });
  });
};

export default runResizeEventTests;
