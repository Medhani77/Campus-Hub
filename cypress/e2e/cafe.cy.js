describe('Campus Cafe Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/Cafe.html')
  })

  it('TC-CF01 - Cafe page loads with ORYN branding', () => {
    cy.contains('ORYN').should('be.visible')
    cy.title().should('include', 'Cafe')
  })

  it('TC-CF01b - All menu category tabs visible', () => {
    cy.get('#categoryTabs').should('be.visible')
    cy.contains('Hot').should('be.visible')
    cy.contains('Main').should('be.visible')
    cy.contains('Snack').should('be.visible')
    cy.contains('Dessert').should('be.visible')
  })

  it('TC-CF02 - Menu section heading visible', () => {
    cy.get('#menu').should('exist')
    cy.get('#menuPanelsContainer').should('exist')
  })

  it('TC-CF03 - Category tab switching works', () => {
    cy.get('#categoryTabs').within(() => {
      cy.contains('Snack').click()
      cy.contains('Hot').click()
      cy.contains('Main').click()
    })
    cy.get('#menuPanelsContainer').should('be.visible')
  })

  it('TC-CF04 - Clear Cart button exists', () => {
    cy.get('.btn-clear').should('exist')
  })

  it('TC-CF05 - Place Order blocked when name/phone empty', () => {
    cy.get('#oName').should('exist').and('be.visible')
    cy.get('#oPhone').should('exist').and('be.visible')
    cy.get('.btn-order').click()
    cy.get('#toast').should('be.visible')
  })

  it('TC-CF07 - Menu panels display even when backend offline', () => {
    cy.get('#menuPanelsContainer', { timeout: 8000 }).should('exist')
    cy.get('#categoryTabs').should('be.visible')
  })

})