describe('Campus Events Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/Events.html')
  })

  it('TC-EV01 - Events page loads with correct title', () => {
    cy.title().should('include', 'Events')
    cy.contains('ORYN').should('be.visible')
  })

  it('TC-EV02 - Upcoming events section displays event cards', () => {
    cy.get('#eventsGrid', { timeout: 8000 }).should('exist')
    cy.get('.event-card', { timeout: 8000 }).should('have.length.greaterThan', 0)
  })

  it('TC-EV03 - Event card has date badge, category and description', () => {
    cy.get('.event-card', { timeout: 8000 }).first().within(() => {
      cy.get('.event-date-badge').should('exist')
      cy.get('.event-category').should('exist')
      cy.get('.event-desc').should('exist')
    })
  })

  it('TC-EV04 - Register button opens registration modal', () => {
    cy.get('.btn-register', { timeout: 8000 }).first().click({ force: true })
    cy.get('#regModal', { timeout: 5000 }).should('be.visible')
    cy.get('#rFullName').should('exist')
    cy.get('#rEmail').should('exist')
    cy.get('#rStudentId').should('exist')
  })

  it('TC-EV05 - Registration modal has all required fields', () => {
    cy.get('.btn-register', { timeout: 8000 }).first().click({ force: true })
    cy.get('#regModal', { timeout: 5000 }).should('be.visible')
    cy.get('#rFullName').should('exist')
    cy.get('#rEmail').should('exist')
    cy.get('#rPhone').should('exist')
    cy.get('#rFaculty').should('exist')
    cy.get('#rYear').should('exist')
    cy.get('#submitBtn').should('exist')
  })

  it('TC-EV06 - Toast notification exists for feedback', () => {
    cy.get('#toast').should('exist')
  })

})
