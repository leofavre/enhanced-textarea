describe('WithResizeEvent', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  afterEach(() => {
    cy.wait(500);
  });

  it('Dispatches an userresize event', () => {
    const handleUserResize = ({ target }) => {
      target.setAttribute('resized', '');
    };

    cy.get('textarea')
      .invoke('on', 'userresize', handleUserResize)
      .invoke('css', 'resize', 'both')
      .screenshot()
      .trigger('pointerdown', 'bottomRight')
      .wait(500)
      .invoke('css', 'width', '250px')
      .invoke('css', 'height', '50px')
      .trigger('pointerup')
      .screenshot()
      .should('have.attr', 'resized');
  });
});
