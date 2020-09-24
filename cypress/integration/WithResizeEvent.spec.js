describe('WithResizeEvent', () => {
  beforeEach(() => {
    cy.visit('/');
    // cy.window().then(win => win.defineEnhancedTextAreaBuiltIn());
  });

  afterEach(() => {
    cy.wait(500);
  });

  it('Dispatches the userresize event', () => {
    const handleUserResize = ({ target }) => {
      target.setAttribute('resized', '');
    };

    cy.get('textarea')
      .invoke('on', 'userresize', handleUserResize)
      .invoke('css', 'resize', 'both')
      .wait(500)
      .screenshot()
      .trigger('pointerdown', 'bottomRight')
      .invoke('css', 'height', '65px')
      .trigger('pointerup')
      .wait(500)
      .screenshot()
      .should('have.attr', 'resized');
  });
});
