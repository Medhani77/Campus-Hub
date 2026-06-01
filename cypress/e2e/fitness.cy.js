describe('Fitness Center Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/fitness.html')
  })

  it('TC-FT01 - Fitness page loads correctly', () => {
    cy.title().should('include', 'Fitness')
    cy.contains('Transform Your Body').should('be.visible')
  })

  it('TC-FT02 - Weekly schedule section displays class cards', () => {
    cy.get('#schedule').should('exist')
    cy.get('#scheduleGrid', { timeout: 8000 }).should('exist')
    cy.get('.class-card', { timeout: 8000 }).should('have.length.greaterThan', 0)
  })

  it('TC-FT03 - Class card has time and info details', () => {
    cy.get('.class-card', { timeout: 8000 }).first().within(() => {
      cy.get('.class-time').should('exist')
      cy.get('.class-info').should('exist')
    })
  })

  it('TC-FT04 - Membership section is visible', () => {
    cy.get('#membership').should('exist')
    cy.get('.btn-membership').should('have.length.greaterThan', 0)
  })

  it('TC-FT05 - Book a session button exists', () => {
    cy.get('.btn-book').should('have.length.greaterThan', 0)
  })

  it('TC-FT06 - Features section renders', () => {
    cy.get('.features-grid').should('exist')
    cy.get('.feature-card').should('have.length.greaterThan', 0)
  })

})
