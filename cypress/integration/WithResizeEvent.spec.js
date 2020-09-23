describe('WithResizeEvent', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  afterEach(() => {
    cy.wait(500);
  });

  it('Dispatches an userresize event', () => {
    cy.get('textarea')
      .invoke('css', 'resize', 'both')
      .trigger('pointerdown', 'bottomRight')
      .wait(500)
      .invoke('css', 'width', '250px')
      .invoke('css', 'height', '50px')
      .trigger('pointerup');
  });
});
