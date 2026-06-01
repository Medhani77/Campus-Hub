describe('Social Feedback Tests', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/social_feedback.html')
  })

  it('TC-SF01 - Social feedback page loads correctly', () => {
    cy.title().should('include', 'Feedback')
    cy.contains('ORYN').should('be.visible')
  })

  it('TC-SF02 - Ratings section visible with rating bars', () => {
    cy.get('#ratings').should('exist')
    cy.get('.big-rating').should('exist')
    cy.get('.bar-row').should('have.length.greaterThan', 0)
  })

  it('TC-SF03 - Write review section has all required fields', () => {
    cy.get('#write-review').should('exist')
    cy.get('#rTitle').should('exist')
    cy.get('#rText').should('exist')
    cy.get('#rService').should('exist')
    cy.get('#rStu').should('exist')
    cy.get('#rName').should('exist')
    cy.get('#rRec').should('exist')
  })

  it('TC-SF04 - Star rating picker exists and is clickable', () => {
    cy.get('#starPick').should('exist')
    cy.get('#starPick .star, #starPick [class*="star"]').should('have.length.greaterThan', 0)
    cy.get('#starPick').find('span, i, [class*="star"]').first().click({ force: true })
  })

  it('TC-SF05 - Submit review button exists', () => {
    cy.get('.btn-submit').should('exist')
  })

  it('TC-SF06 - Opinion section renders with submit button', () => {
    cy.get('#opinion').should('exist')
    cy.get('#oName').should('exist')
    cy.get('#oEmail').should('exist')
    cy.get('#oService').should('exist')
    cy.get('#oText').should('exist')
    cy.get('.btn-submit-opinion').should('exist')
  })

  it('TC-SF07 - Toast notification element exists', () => {
    cy.get('#toast').should('exist')
  })

})
